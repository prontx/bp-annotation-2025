import { useEffect } from "react"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { useSelector } from "react-redux"
import { resetShouldTriggerUpdate, selectHistory, selectShouldTriggerUpdate } from "../redux/workspaceSlice"
import { setSegmentsFromHistory, setSpeakersFromHistory, setSegmentTagsFromHistory, selectSpeaker2Color, setRegion2IDFromHistory } from "../../transcript/redux/transcriptSlice"
import { setGroupingFromHistory } from "../../grouping/redux/groupingSlice"


import { rgba } from "@carbon/colors"

// types
import type RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js"


export const useUndoRedo = (waveformRegionsRef: React.MutableRefObject<RegionsPlugin>) => {
    const dispatch = useAppDispatch()
    const current = useSelector(selectHistory)
    const shouldTriggerUpdate = useSelector(selectShouldTriggerUpdate)
    const speaker2color       = useSelector(selectSpeaker2Color)

    useEffect(() => {
        if (!current || !shouldTriggerUpdate)
            return

        dispatch(setSegmentsFromHistory(current.transcript.segments))
        dispatch(setSpeakersFromHistory(current.transcript.speaker_tags))
        dispatch(setGroupingFromHistory(current.grouping))
        dispatch(setSegmentTagsFromHistory(current.transcript.segment_tags))
        dispatch(setRegion2IDFromHistory(current.transcript.region2ID))
        waveformRegionsRef.current.clearRegions()

        // Adding every region from the snapshot
        for (const key of current.transcript.segments.keys) {
          const seg = current.transcript.segments.entities[key]
          if (!seg) continue
        
          const rid = current.transcript.region2ID[key]
          waveformRegionsRef.current.addRegion({
            id:       rid,
            start:    seg.start,
            end:      seg.end,
            drag:     true,
            minLength: 0.1,
            color:    rgba(speaker2color[seg.speaker], 0.4),
          })
        }
      
        dispatch(resetShouldTriggerUpdate())


    }, [current, shouldTriggerUpdate, waveformRegionsRef, dispatch, speaker2color])
}
