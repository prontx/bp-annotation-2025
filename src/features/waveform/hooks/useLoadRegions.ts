import { useEffect } from "react";

// redux
import { useAppDispatch } from "../../../redux/hooks";
import { useSelector } from "react-redux";
import { createSegment, mapRegion2Segment, selectSegments, updateSegment } from "../../transcript/redux/transcriptSlice";
import { selectSpeaker2Color } from "../../transcript/redux/transcriptSlice";

// wavesurfer
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/plugins/regions"

// utils
// @ts-ignore
import { rgba } from "@carbon/colors"


const useLoadRegions = (wavesurfer: React.MutableRefObject<WaveSurfer | null>,
                        waveformRegionsRef: React.MutableRefObject<RegionsPlugin>) => {
    const dispatch = useAppDispatch()
    const segments = useSelector(selectSegments)
    const speaker2color = useSelector(selectSpeaker2Color)

    useEffect(() => {
        if (!wavesurfer.current || !segments.keys)
            return
        const regions = waveformRegionsRef.current.getRegions()

        // load all regions
        if (regions.length === 0){
            segments.keys.forEach(key => {
                const segment = segments.entities[key]
                const region = waveformRegionsRef.current.addRegion({
                    start: segment.start,
                    end: segment.end,
                    drag: false,
                    color: rgba(speaker2color[segment.speaker] || "#c6c6c6", 0.4)
                })
                dispatch(mapRegion2Segment({segmentID: key, regionID: region.id}))
            })
        }

        const subscriptions = [
            waveformRegionsRef.current.on('region-created', (region) => {
                region.setOptions({
                    start: region.start,
                    color: rgba(speaker2color["A"] || "#c6c6c6", 0.4),
                })
                dispatch(createSegment({
                    regionID: region.id,
                    start: region.start,
                    end: region.end
                }))
            }),
            waveformRegionsRef.current.on('region-updated', (region) => {
                dispatch(updateSegment({
                    type: "region",
                    key: region.id,
                    change: {
                        start: region.start,
                        end: region.end
                    }
                }))
            })
        ]

        return () => subscriptions.forEach(unsub => unsub())
    }, [wavesurfer, segments, waveformRegionsRef.current])
}

export default useLoadRegions
