import { useEffect } from "react"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { useSelector } from "react-redux"
import { selectSegmentsJSON, selectTranscriptStatus } from "../../transcript/redux/transcriptSlice"
import { selectSpeakers } from "../../job/redux/jobSlice"
import { selectGroups } from "../../grouping/redux/groupingSlice"
import { historyPush, resetShouldTriggerUpdate, selectShouldTriggerUpdate } from "../redux/historySlice"

// types
import { Snapshot } from "../types/History"
import { useUndoRedo } from "./useUndoRedo"


export const useHistory = () => {
    const dispatch = useAppDispatch()
    const segmentsJSON = useSelector(selectSegmentsJSON)
    const speakerTags = useSelector(selectSpeakers)
    const groups = useSelector(selectGroups)
    const status = useSelector(selectTranscriptStatus)
    const shouldTriggerUpdate = useSelector(selectShouldTriggerUpdate)

    useUndoRedo()

    useEffect(() => {
        if (status === "loading" || status === "error" || status === "idle" || status === "")
            return

        if (shouldTriggerUpdate){ // do not add snapshot if history got loaded
            dispatch(resetShouldTriggerUpdate())
            return
        }

        const snapshot: Snapshot = {
            transcript: {
                segments: JSON.parse(segmentsJSON),
                speaker_tags: speakerTags,
            },
            grouping: {groups: groups},
        }
        dispatch(historyPush(snapshot))
    }, [segmentsJSON, speakerTags, groups])
}