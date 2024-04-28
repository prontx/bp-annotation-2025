import { useEffect } from "react"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { useSelector } from "react-redux"
import { selectSegments, selectTranscriptStatus } from "../../transcript/redux/transcriptSlice"
import { selectSpeakers } from "../../transcript/redux/transcriptSlice"
import { selectGroups, selectStartEndSegment2Group } from "../../grouping/redux/groupingSlice"
import { historyPush, resetShouldTriggerUpdate, selectHistoryEnable, selectShouldTriggerUpdate } from "../redux/workspaceSlice"

// types
import { Snapshot } from "../types/History"
import { useUndoRedo } from "./useUndoRedo"
import type RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js"


export const useHistory = (waveformRegionsRef: React.MutableRefObject<RegionsPlugin>) => {
    const dispatch = useAppDispatch()
    const segments = useSelector(selectSegments)
    const speakerTags = useSelector(selectSpeakers)
    const groups = useSelector(selectGroups)
    const {startSegment2Group, endSegment2Group} = useSelector(selectStartEndSegment2Group)
    const status = useSelector(selectTranscriptStatus)
    const shouldTriggerUpdate = useSelector(selectShouldTriggerUpdate)
    const historyEnable = useSelector(selectHistoryEnable)

    useUndoRedo(waveformRegionsRef)

    useEffect(() => {
        if (status === "loading" || status === "error" || status === "idle" || status === "")
            return

        if (!historyEnable)
            return

        if (shouldTriggerUpdate){ // do not add snapshot if history got loaded
            dispatch(resetShouldTriggerUpdate())
            return
        }

        const snapshot: Snapshot = {
            transcript: {
                segments: segments,
                speaker_tags: speakerTags,
            },
            grouping: {
                groups: groups,
                startSegment2Group: startSegment2Group,
                endSegment2Group: endSegment2Group,
            },
        }
        dispatch(historyPush(snapshot))
    }, [segments, speakerTags, groups, startSegment2Group, endSegment2Group])
}
