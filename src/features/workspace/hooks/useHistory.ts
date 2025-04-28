import { useEffect, useRef } from "react"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { useSelector } from "react-redux"
import { selectSegmentTags, selectSegments, selectTranscriptStatus } from "../../transcript/redux/transcriptSlice"
import { selectSpeakers } from "../../transcript/redux/transcriptSlice"
import { selectGroups, selectStartEndSegment2Group } from "../../grouping/redux/groupingSlice"
import { enableHistory, historyPush, resetShouldTriggerUpdate, selectHistoryEnable, selectShouldTriggerUpdate } from "../redux/workspaceSlice"

// types
import { Snapshot } from "../types/History"
import { useUndoRedo } from "./useUndoRedo"
import type RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js"
import { RootState } from "../../../redux/store"


export const useHistory = (waveformRegionsRef: React.MutableRefObject<RegionsPlugin>) => {
    const dispatch = useAppDispatch()
    const segments = useSelector(selectSegments)
    const speakerTags = useSelector(selectSpeakers)
    const segmentTags = useSelector(selectSegmentTags)
    const region2ID = useSelector((s: RootState) => s.transcript.region2ID)
    const groups = useSelector(selectGroups)
    const {startSegment2Group, endSegment2Group} = useSelector(selectStartEndSegment2Group)
    const status = useSelector(selectTranscriptStatus)
    const shouldTriggerUpdate = useSelector(selectShouldTriggerUpdate)
    const historyEnable = useSelector(selectHistoryEnable)

    //  The latest snapshot pushed
    const lastSerializedRef = useRef<string|null>(null)
    const timerRef = useRef<number>()

    useEffect(() => {
        if (status === "succeeded" && !historyEnable) {
            dispatch(enableHistory())
    }
    }, [status, historyEnable, dispatch])

    useEffect(() => {
        if (!historyEnable) return

        // undo in progress
        if (shouldTriggerUpdate) {
            dispatch(resetShouldTriggerUpdate())
            return
        }

        clearTimeout(timerRef.current)

        timerRef.current = window.setTimeout(() => {
          const snap: Snapshot = {
            transcript: {
              segments,
              speaker_tags: speakerTags,
              segment_tags: segmentTags,
              region2ID,
            },
            grouping: {
              groups,
              startSegment2Group,
              endSegment2Group,
            },
          }

          const ser = JSON.stringify(snap)
          // Push if DIfferent
          if (ser !== lastSerializedRef.current) {
                dispatch(historyPush(snap))
                lastSerializedRef.current = ser
          }
        }, 250)

        return () => clearTimeout(timerRef.current)
    }, [historyEnable, shouldTriggerUpdate, segments, speakerTags, segmentTags, region2ID,
      groups, startSegment2Group, endSegment2Group, dispatch])

    useUndoRedo(waveformRegionsRef)
}
