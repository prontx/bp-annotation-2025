import { useEffect, useRef, useCallback } from "react";

// Redux
import { useAppDispatch } from "../../../redux/hooks";
import { useSelector } from "react-redux";
import { mapRegion2Segment, selectSegments} from "../../transcript/redux/transcriptSlice";
import { selectSpeaker2Color } from "../../transcript/redux/transcriptSlice";

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
    const speaker2color = useSelector(selectSpeaker2Color);
    
    // Keep track of already rendered segments
    const renderedSegments = useRef<Set<string>>(new Set());

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

    useEffect(() => {
        if (!wavesurfer.current || !segments.keys) return;

        // Load visible regions initially
        loadVisibleRegions();

        // Subscribe to relevant WaveSurfer events
        wavesurfer.current?.on("scroll", loadVisibleRegions);
        wavesurfer.current?.on("zoom", loadVisibleRegions);
        wavesurfer.current?.on("seek" as any, handleClick);

        // Clean up event listeners on unmount
        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.un("scroll", loadVisibleRegions);
                wavesurfer.current.un("zoom", loadVisibleRegions);
                wavesurfer.current.un("seek" as any, handleClick);
            }
        };
    }, [wavesurfer, segments, dispatch, waveformRegionsRef, loadVisibleRegions, handleClick]);

    return null;
};

export default useLoadRegions;
