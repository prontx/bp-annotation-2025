import { useEffect, useRef, useCallback } from "react";

// Redux
import { useAppDispatch } from "../../../redux/hooks";
import { useSelector } from "react-redux";
import { createSegment, mapRegion2Segment, selectSegments, updateSegment } from "../../transcript/redux/transcriptSlice";
import { selectSpeaker2Color } from "../../transcript/redux/transcriptSlice";

// WaveSurfer
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, {Region} from "wavesurfer.js/plugins/regions";

// Utils
// @ts-ignore
import { rgba } from "@carbon/colors";

import type { RootState } from "../../../redux/store"

import { v4 as uuid } from 'uuid'

const useLoadRegions = (wavesurfer: React.MutableRefObject<WaveSurfer | null>, 
                        waveformRegionsRef: React.MutableRefObject<RegionsPlugin>) => {
    const dispatch = useAppDispatch();
    const segments = useSelector(selectSegments);
    const speaker2color = useSelector(selectSpeaker2Color);
    
    const mostRecentSpeaker = useSelector(
        (state: RootState) => state.transcript.mostRecentSpeaker
    );

    // Keep track of already rendered segments
    const renderedSegments = useRef<Set<string>>(new Set());

     // Select `region2ID` from Redux state
     const region2ID = useSelector((state: RootState) => state.transcript.region2ID);


    // Function to load visible regions
    const loadVisibleRegions = useCallback(() => {
        const visibleRangeStart = wavesurfer.current?.getCurrentTime() || 0;
        const containerWidth = wavesurfer.current?.getWrapper().clientWidth || 0;
        const duration = wavesurfer.current?.getDuration() || 0;
        const pixelsPerSecond = containerWidth / duration;
        const visibleRangeEnd = visibleRangeStart + containerWidth / pixelsPerSecond;

        segments.keys.forEach((key) => {
            const segment = segments.entities[key];
            // Render segment if it's visible and hasn't been rendered yet
            if (
                segment.start < visibleRangeEnd &&
                segment.end > visibleRangeStart &&
                !renderedSegments.current.has(key)
            ) {
                const region = waveformRegionsRef.current.addRegion({
                    start: segment.start,
                    end: segment.end,
                    drag: false,
                    minLength: 0.1,
                    color: rgba(speaker2color[segment.speaker] || "#c6c6c6", 0.4),
                });
                dispatch(mapRegion2Segment({ segmentID: key, regionID: region.id }));
                renderedSegments.current.add(key); // Mark segment as rendered
            }
        });
    }, [wavesurfer, segments, speaker2color, dispatch, waveformRegionsRef]);

    // Function to handle region creation (for creating segments)
    const handleRegionCreated = useCallback(
        (region: Region) => {
            const regionEnd = Math.max(region.start + 0.1, region.end);
            
            region.setOptions({
                start: region.start,
                end: regionEnd,
                drag: false,
                color: rgba(speaker2color[mostRecentSpeaker] || "#c6c6c6", 0.4),
            });

            dispatch(createSegment({
                regionID: uuid(),
                start: region.start,
                end: regionEnd,
            }));
        },
        [dispatch, speaker2color, mostRecentSpeaker] // Add to dependencies
    );
    
    



     // Function to handle region resize and dispatch updates to Redux
     const handleResize = useCallback(
        (region: Region) => {
            if (!region || !region.id) {
                console.warn("Region is undefined or missing an ID:", region);
                return;
            }
    
            // Retrieve the segment ID from Redux
            const segmentID = region2ID[region.id];
            if (!segmentID) {
                console.error(`No segment ID found for region ID: ${region.id}`);
                return;
            }
    
            // Get the segment being resized
            const segment = segments.entities[segmentID];
            if (!segment) return;
    
            let newStart = region.start;
            let newEnd = region.end;
            const minDuration = 0.1; // Minimum segment length to prevent collapsing
    
            // Find the next segment that starts after this one
            const nextSegment = Object.values(segments.entities).find(
                (otherSegment) =>
                    otherSegment !== segment &&
                    otherSegment.start >= newStart && // Must be positioned after this one
                    otherSegment.start < newEnd // Only matters if it overlaps
            );
    
            // Find the previous segment that ends before this one
            const prevSegment = Object.values(segments.entities).find(
                (otherSegment) =>
                    otherSegment !== segment &&
                    otherSegment.end <= newEnd && // Must be positioned before this one
                    otherSegment.end > newStart // Only matters if it overlaps
            );
    
            // Adjust newEnd to prevent overlapping into the next segment
            if (nextSegment) {
                newEnd = Math.max(newStart + minDuration, Math.min(newEnd, nextSegment.start));
            }
    
            // Adjust newStart to prevent overlapping into the previous segment
            if (prevSegment) {
                newStart = Math.min(newEnd - minDuration, Math.max(newStart, prevSegment.end));
            }
    
            // Apply the corrected values to the region
            region.setOptions({ start: newStart, end: newEnd });
    
            // Dispatch the update
            dispatch(
                updateSegment({
                    type: "region",
                    key: segmentID,
                    change: {
                        start: newStart,
                        end: newEnd,
                    },
                })
            );
    
            console.log(`Segment updated: ID=${segmentID}, Start=${newStart}, End=${newEnd}`);
        },
        [region2ID, dispatch, segments]
    );
    
    
    
    
    
    

    // Function to handle click and load segments at the clicked position
    const handleClick = () => {
        const currentTime = wavesurfer.current?.getCurrentTime() || 0;
        segments.keys.forEach((key) => {
            const segment = segments.entities[key];
            if (segment.start <= currentTime && segment.end >= currentTime && !renderedSegments.current.has(key)) {
                // Load segment if it is clicked
                const region = waveformRegionsRef.current.addRegion({
                    start: segment.start,
                    end: segment.end,
                    drag: false,
                    minLength: 0.1,
                    color: rgba(speaker2color[segment.speaker] || "#c6c6c6", 0.4),
                });
                dispatch(mapRegion2Segment({ segmentID: key, regionID: region.id }));
                renderedSegments.current.add(key); // Mark segment as rendered
            }
        });
    };

    // another option using callback, just in case:
    
    // const handleClick = useCallback(() => {
        // const currentTime = wavesurfer.current?.getCurrentTime() || 0;
        // segments.keys.forEach((key) => {
        //   const segment = segments.entities[key];
        //   if (segment.start <= currentTime && segment.end >= currentTime && !renderedSegments.current.has(key)) {
            // Load segment if it is clicked
            // const region = waveformRegionsRef.current.addRegion({
            //   start: segment.start,
            //   end: segment.end,
            //   drag: false,
            //   minLength: 0.1,
            //   color: rgba(speaker2color[segment.speaker] || "#c6c6c6", 0.4),
            // });
            // dispatch(mapRegion2Segment({ segmentID: key, regionID: region.id }));
            // renderedSegments.current.add(key); // Mark segment as rendered
        //   }
        // });
    //   }, [wavesurfer, segments, speaker2color, dispatch, waveformRegionsRef]);

    useEffect(() => {
        if (!wavesurfer.current || !segments.keys) return
        
        // Initial region load
        loadVisibleRegions();
    
        // Subscribe to WaveSurfer events
        wavesurfer.current.on("scroll", loadVisibleRegions);
        wavesurfer.current.on("zoom", loadVisibleRegions);
        wavesurfer.current.on("seek" as any, handleClick);
    
        // Attach the resize event listener and debug
        if (waveformRegionsRef.current) {
            waveformRegionsRef.current.on("region-created", (region) => {
                if (!region || region.start === region.end || region.start < 0) {
                    console.error("Invalid region:", region);
                    if (region && typeof region.remove === "function") {
                        try {
                            region.remove();
                        } catch (error) {
                            console.warn("Error removing region:", error);
                        }
                    }
                    return;
                }
                handleRegionCreated(region);
            });
            
            waveformRegionsRef.current.on("region-updated", (region: Region) => {
                console.log("Region updated:", region); // Debug region
                handleResize(region); // Handle resize logic
            });
        }
    
        // Clean up event listeners
        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.un("scroll", loadVisibleRegions);
                wavesurfer.current.un("zoom", loadVisibleRegions);
                wavesurfer.current.un("seek" as any, handleClick);
            }
    
            if (waveformRegionsRef.current) {
                waveformRegionsRef.current.un("region-created", handleRegionCreated);
                waveformRegionsRef.current.un("region-updated", handleResize);
            }
        };
    }, [
        wavesurfer,
        segments,
        dispatch,
        waveformRegionsRef,
        loadVisibleRegions,
        handleClick,
        handleResize,
    ]);
    

    return null;
};

export default useLoadRegions;
