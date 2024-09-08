import { useEffect, useRef } from "react";

// Redux
import { useAppDispatch } from "../../../redux/hooks";
import { useSelector } from "react-redux";
import { createSegment, mapRegion2Segment, selectSegments, selectSpeakers, updateSegment } from "../../transcript/redux/transcriptSlice";
import { selectSpeaker2Color } from "../../transcript/redux/transcriptSlice";
import { selectGroups } from "../../grouping/redux/groupingSlice";

// WaveSurfer
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/plugins/regions";

// Utils
// @ts-ignore
import { rgba } from "@carbon/colors";

const useLoadRegions = (wavesurfer: React.MutableRefObject<WaveSurfer | null>, 
                        waveformRegionsRef: React.MutableRefObject<RegionsPlugin>) => {
    const dispatch = useAppDispatch();
    const segments = useSelector(selectSegments);
    const speakers = useSelector(selectSpeakers);
    const groups = useSelector(selectGroups);
    const speaker2color = useSelector(selectSpeaker2Color);
    
    // Keep track of already rendered segments to avoid duplicates
    const renderedSegments = useRef<Set<string>>(new Set());

    useEffect(() => {
        if (!wavesurfer.current || !segments.keys) return;
        const regions = waveformRegionsRef.current.getRegions();

        // Function to load only the visible segments
        const loadVisibleRegions = () => {
            const visibleRangeStart = wavesurfer.current?.getCurrentTime() || 0;
            const containerWidth = wavesurfer.current?.getWrapper().clientWidth || 0;
            const duration = wavesurfer.current?.getDuration() || 0;
            const pixelsPerSecond = containerWidth / duration;
            const visibleRangeEnd = visibleRangeStart + containerWidth / pixelsPerSecond;

            segments.keys.forEach((key) => {
                const segment = segments.entities[key];
                // Render segment only if it's visible and hasn't been rendered yet
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
        };

        // Load the initial visible regions
        if (regions.length === 0) {
            loadVisibleRegions();
        }

        // Handle scroll/zoom/seek to load more regions on demand
        const handleInteraction = () => {
            loadVisibleRegions();
        };

        // Subscribe to relevant WaveSurfer events
        wavesurfer.current?.on("scroll", handleInteraction);
        wavesurfer.current?.on("zoom", handleInteraction);
        wavesurfer.current?.on("seek" as any, handleInteraction);

        // Clean up event listeners on unmount
        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.un("scroll", handleInteraction);
                wavesurfer.current.un("zoom", handleInteraction);
                wavesurfer.current.un("seek" as any, handleInteraction);
            }
        };
    }, [wavesurfer, segments, speakers, groups, speaker2color, dispatch, waveformRegionsRef]);
};

export default useLoadRegions;
