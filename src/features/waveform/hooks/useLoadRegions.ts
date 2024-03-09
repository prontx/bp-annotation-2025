import { useEffect } from "react";

// redux
import { useAppDispatch } from "../../../redux/hooks";
import { playSegment } from "../../playback/redux/playbackSlice";
import { useSelector } from "react-redux";
import { createSegment, selectSegments, updateSegment } from "../../transcript/redux/transcriptSlice";

// wavesurfer
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/plugins/regions"


const useLoadRegions = (wavesurfer: React.MutableRefObject<WaveSurfer | null>,
                        waveformRegionsRef: React.MutableRefObject<RegionsPlugin>) => {
    const dispatch = useAppDispatch()
    const segments = useSelector(selectSegments)

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
                    color: "rgba(128, 128, 255, 0.4)" // TODO: set color by speaker
                })
                dispatch(updateSegment({type: "id", key: key, change: {regionID: region.id}}))
            })
        }

        const subscriptions = [
            waveformRegionsRef.current.on('region-created', (region) => {
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
            }),
            waveformRegionsRef.current.on('region-clicked', (region, e) => {
                e.stopPropagation() // prevent triggering a click on the waveform
                region.play()
                dispatch(playSegment({from: region.start, to: region.end, changedBy: "regionClick"}))
                
                // region.setOptions({ color: "rgba(128, 128, 255, 0.4)" })
            })
        ]

        return () => subscriptions.forEach(unsub => unsub())
    }, [wavesurfer, segments, waveformRegionsRef.current])
}

export default useLoadRegions
