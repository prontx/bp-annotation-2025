import { useEffect } from "react"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { useSelector } from "react-redux"
import { selectHistory, selectShouldTriggerUpdate } from "../redux/workspaceSlice"
import { setSegmentsFromHistory, setSpeakersFromHistory, setSegmentTagsFromHistory } from "../../transcript/redux/transcriptSlice"
import { setGroupingFromHistory } from "../../grouping/redux/groupingSlice"

// types
import type RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js"


export const useUndoRedo = (waveformRegionsRef: React.MutableRefObject<RegionsPlugin>) => {
    const dispatch = useAppDispatch()
    const current = useSelector(selectHistory)
    const shouldTriggerUpdate = useSelector(selectShouldTriggerUpdate)

    useEffect(() => {
        if (!current || !shouldTriggerUpdate)
            return

        dispatch(setSegmentsFromHistory(current.transcript.segments))
        dispatch(setSpeakersFromHistory(current.transcript.speaker_tags))
        dispatch(setGroupingFromHistory(current.grouping))
        dispatch(setSegmentTagsFromHistory(current.transcript.segment_tags))
        waveformRegionsRef.current.clearRegions()
    }, [current, shouldTriggerUpdate, waveformRegionsRef])
}
