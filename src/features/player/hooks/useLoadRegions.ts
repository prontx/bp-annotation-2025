import { useEffect, useRef, useCallback } from "react";

// Redux
import { useAppDispatch } from "../../../redux/hooks";
import { useSelector } from "react-redux";
import { createSegment, mapRegion2Segment, selectSegments, updateSegment, clearDeletedRegions } from "../../transcript/redux/transcriptSlice";
import { selectSpeaker2Color, resetLastCreatedSegmentID, setActiveSegmentId, resetActiveSegmentId } from "../../transcript/redux/transcriptSlice";
import { selectSegmentOverlapEnabled } from "../../workspace/redux/workspaceSlice";

// WaveSurfer
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, {Region} from "wavesurfer.js/plugins/regions";

// Utils
// @ts-ignore
import { rgba } from "@carbon/colors";

import type { RootState } from "../../../redux/store"

import { v4 as uuid } from 'uuid'


const scrollToSegmentEvent = (segmentID: string) => {
    const event = new CustomEvent('scrollToSegment', { 
      detail: { segmentID } 
    });
    window.dispatchEvent(event);
  };

const useLoadRegions = (wavesurfer: React.MutableRefObject<WaveSurfer | null>, 
                        waveformRegionsRef: React.MutableRefObject<RegionsPlugin>) => {
    const dispatch = useAppDispatch();
    const segments = useSelector(selectSegments);
    const speaker2color = useSelector(selectSpeaker2Color);

    const containerRef = useRef<HTMLElement | null>(null);

    
    const mostRecentSpeaker = useSelector(
        (state: RootState) => state.transcript.mostRecentSpeaker
    );

    // Keep track of already rendered segments
    const renderedSegments = useRef<Set<string>>(new Set());

     // Select `region2ID` from Redux state
     const region2ID = useSelector((state: RootState) => state.transcript.region2ID);

    const deletedRegions = useSelector((state: RootState) => state.transcript.deletedRegions);
    const segmentOverlap = useSelector(selectSegmentOverlapEnabled);

    // handle color updates
    useEffect(() => {
        renderedSegments.current.clear();
        waveformRegionsRef.current.clearRegions();
        loadVisibleRegions();
    }, [speaker2color, segments.entities]); 

    // Function to load visible regions
    const loadVisibleRegions = useCallback(() => {

        if (!wavesurfer.current) return;
        const container = wavesurfer.current.getWrapper();
        if (!container) return;
    
        // Track container for resize observer
        containerRef.current = container;



        const visibleRangeStart = wavesurfer.current?.getCurrentTime() || 0;
        const containerWidth = wavesurfer.current?.getWrapper().clientWidth || 0;
        const duration = wavesurfer.current?.getDuration() || 0;
        const pixelsPerSecond = containerWidth / duration;
        const visibleRangeEnd = visibleRangeStart + containerWidth / pixelsPerSecond;

        if (!speaker2color || Object.keys(speaker2color).length === 0) {
            return;  
        }


        // Add 10% padding to visible range
    const visiblePadding = duration * 0.1;
    const visibleRange = {
        start: Math.max(0, visibleRangeStart - visiblePadding),
        end: Math.min(duration, visibleRangeStart + (containerWidth / (containerWidth / duration)) + visiblePadding)
    };

        segments.keys.forEach((key) => {
            const segment = segments.entities[key];
            if (!segment) return;

            const speakerColor = speaker2color[segment.speaker] || "#000000"; // Fallback grey;
            if (!speakerColor) {
                console.warn(`Missing color for speaker: ${segment.speaker}`);
                return;
            }

            if (
                segment.start < visibleRange.end &&
                segment.end > visibleRange.start &&
                !renderedSegments.current.has(key)
            ) {
                 // Force re-render even if previously rendered
                renderedSegments.current.delete(key);
                
                // Remove existing region if present
                const existingRegion = waveformRegionsRef.current.getRegions()
                    .find(r => r.id === region2ID[key]);
                if (existingRegion) {
                    existingRegion.remove();
                }

                // Create new region with updated color
                const region = waveformRegionsRef.current.addRegion({
                    start: segment.start,
                    end: segment.end,
                    drag: true,
                    minLength: 0.1,
                    color: rgba(speakerColor, 0.4), 
                });
                
                dispatch(mapRegion2Segment({ segmentID: key, regionID: region.id }));
                renderedSegments.current.add(key);
            }
        });
    }, [wavesurfer, segments, speaker2color, dispatch, waveformRegionsRef, region2ID]);

    

    // Function to handle region creation 
    const handleRegionCreated = useCallback((region: Region) => {
        const regionEnd = Math.max(region.start + 0.1, region.end);
        
        region.setOptions({
            start: region.start,
            end: regionEnd,
            drag: true,
            color: rgba(speaker2color[mostRecentSpeaker] || "red", 0.4),
        });
    
        const segmentID = uuid(); 
        
        region.on('click', () => {
            dispatch({
                type: 'transcript/mapRegion2Segment',
                payload: {
                    segmentID: segmentID,
                    regionID: region.id
                }
            });
        });
    
        dispatch(createSegment({
            regionID: region.id, // Match region ID format
            start: region.start,
            end: regionEnd,
        }));
    
    }, [dispatch, speaker2color, mostRecentSpeaker]);
    
    const handleSegmentMove = useCallback(
        (region: Region) => {
            if (!region || !region.id) {
                console.warn("Region is undefined or missing an ID:", region);
                return;
            }
    
            const segmentID = region2ID[region.id];
            if (!segmentID) {
                console.error(`No segment ID found for region ID: ${region.id}`);
                return;
            }
    
            const segment = segments.entities[segmentID];
            if (!segment) return;
    
            // Get values from region without overlap constraints
            let newStart = region.start;
            let newEnd = region.end;
    
            if (!segmentOverlap) {
                const duration = segment.end - segment.start;
                newEnd = newStart + duration;
    
                const nextSegment = Object.values(segments.entities).find(
                    other => other !== segment &&
                    other.start >= newStart && 
                    other.start < newEnd
                );
    
                const prevSegment = Object.values(segments.entities).find(
                    other => other !== segment &&
                    other.end <= newEnd && 
                    other.end > newStart
                );
    
                if (nextSegment) newStart = Math.min(newStart, nextSegment.start - duration);
                if (prevSegment) newStart = Math.max(newStart, prevSegment.end);
                newEnd = newStart + duration;
            }
    

            // Update region position
            region.setOptions({ start: newStart, end: newEnd });
    
            // Dispatch update to Redux
            dispatch(updateSegment({
                type: "region",
                key: segmentID,
                change: {
                    start: newStart,
                    end: newEnd,
                },
            }));
    
            console.log(`Segment moved: ID=${segmentID}, Start=${newStart}, End=${newEnd}`);
        },
        [region2ID, dispatch, segments, segmentOverlap]
    );


     // Function to handle region resize and dispatch updates to Redux
     const handleResize = useCallback(
        (region: Region) => {
            if (!region || !region.id) {
                console.warn("Region is undefined or missing an ID:", region);
                return;
            }
    
            const segmentID = region2ID[region.id];
            if (!segmentID) return;
    
            const segment = segments.entities[segmentID];
            if (!segment) return;
    
            let newStart = region.start;
            let newEnd = region.end;
            const minDuration = 0.1;
    
            if (!segmentOverlap) {
                const nextSegment = Object.values(segments.entities).find(
                    other => other !== segment &&
                    other.start >= newStart && 
                    other.start < newEnd
                );
    
                const prevSegment = Object.values(segments.entities).find(
                    other => other !== segment &&
                    other.end <= newEnd && 
                    other.end > newStart
                );
    
                if (nextSegment) newEnd = Math.max(newStart + minDuration, Math.min(newEnd, nextSegment.start));
                if (prevSegment) newStart = Math.min(newEnd - minDuration, Math.max(newStart, prevSegment.end));
            } else {
                // Only enforce minimum duration
                if ((newEnd - newStart) < minDuration) {
                    newEnd = newStart + minDuration;
                }
            }


            region.setOptions({ start: newStart, end: newEnd });
    
            dispatch(updateSegment({
                type: "region",
                key: segmentID,
                change: {
                    start: newStart,
                    end: newEnd,
                },
            }));
    
            console.log(`Segment updated: ID=${segmentID}, Start=${newStart}, End=${newEnd}`);
        },
        [region2ID, dispatch, segments, segmentOverlap]
    );
    
    
    
    
    

    // Function to handle click and load segments at the clicked position
const handleClick = () => {
    const currentTime = wavesurfer.current?.getCurrentTime() || 0;
    
    // Find exact matching segment
    const clickedSegment = segments.keys.find(key => {
        const segment = segments.entities[key];
        return segment && 
               segment.start <= currentTime && 
               segment.end >= currentTime;
    });

    if (!clickedSegment) {
        console.log("No segment found at:", currentTime);
        return;
    }

    //  Force region creation if missing
    if (!renderedSegments.current.has(clickedSegment)) {
        const region = waveformRegionsRef.current.addRegion({
            id: `region-${clickedSegment}`, 
            start: segments.entities[clickedSegment].start,
            end: segments.entities[clickedSegment].end,
            drag: false,
            minLength: 0.1,
            color: rgba(speaker2color[segments.entities[clickedSegment].speaker] || "red", 0.4),
        });
        renderedSegments.current.add(clickedSegment);
    }

    // Trigger scroll like in createSegment
    dispatch({
        type: 'transcript/mapRegion2Segment',
        payload: {
            segmentID: clickedSegment,
            regionID: `region-${clickedSegment}` // Match region ID format
        }
    });
};


     useEffect(() => {
        if (deletedRegions.length > 0 && waveformRegionsRef.current) {
            // Remove regions from wavesurfer
            deletedRegions.forEach(regionID => {
                const region = waveformRegionsRef.current.getRegions().find(r => r.id === regionID);
                if (region) region.remove();
            });
            
            // Clear processed deletions
            dispatch(clearDeletedRegions());
        }
    }, [deletedRegions, dispatch, waveformRegionsRef]);


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
                
                // Use requestAnimationFrame to ensure DOM updates
                requestAnimationFrame(() => {
                    handleRegionCreated(region);
                });
            });
            
            waveformRegionsRef.current.on("region-updated", (region: Region) => {
                const segmentID = region2ID[region.id];
                if (!segmentID) return;
            
                const segment = segments.entities[segmentID];
                if (!segment) return;
            
                const isStartChanged = Math.abs(segment.start - region.start) > 0.01;
                const isEndChanged = Math.abs(segment.end - region.end) > 0.01;
            
                if (isStartChanged && isEndChanged) {
                    handleSegmentMove(region);  // Full dragging
                } else {
                    console.log("resizin")
                    handleResize(region);  // Resizing (only start or end changed)
                }
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
        handleSegmentMove
    ]);
    

    return null;
};

export default useLoadRegions;
