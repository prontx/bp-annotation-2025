import { useEffect } from "react"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { useSelector } from "react-redux"
import { selectHistory, selectShouldTriggerUpdate } from "../redux/historySlice"
import { setSegmentsFromHistory, setSpeakersFromHistory } from "../../transcript/redux/transcriptSlice"
import { setGroupingFromHistory } from "../../grouping/redux/groupingSlice"


export const useUndoRedo = () => {
    const dispatch = useAppDispatch()
    const current = useSelector(selectHistory)
    const shouldTriggerUpdate = useSelector(selectShouldTriggerUpdate)

    useEffect(() => {
        if (!current || !shouldTriggerUpdate)
            return

        dispatch(setSegmentsFromHistory(current.transcript.segments))
        dispatch(setSpeakersFromHistory(current.transcript.speaker_tags))
        dispatch(setGroupingFromHistory(current.grouping))
    }, [current, shouldTriggerUpdate])
}
