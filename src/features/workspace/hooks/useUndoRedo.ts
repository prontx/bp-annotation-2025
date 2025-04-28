import { useEffect } from "react"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { batch, useSelector } from "react-redux"
import { resetShouldTriggerUpdate, selectHistory, selectShouldTriggerUpdate } from "../redux/workspaceSlice"
import { setSegmentsFromHistory, setSpeakersFromHistory, setSegmentTagsFromHistory, selectSpeaker2Color, setRegion2IDFromHistory } from "../../transcript/redux/transcriptSlice"
import { setGroupingFromHistory } from "../../grouping/redux/groupingSlice"


import { rgba } from "@carbon/colors"

// types
import type RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js"
import { RootState } from "../../../redux/store"


export const useUndoRedo = (
  waveformRegionsRef: React.MutableRefObject<RegionsPlugin>) => {
    const dispatch            = useAppDispatch()
    const history             = useSelector((s: RootState) => s.workspace.history)
    const shouldTriggerUpdate = useSelector(selectShouldTriggerUpdate) 

    useEffect(() => {
      if (!shouldTriggerUpdate) return   

      const snap = history.snapshots[history.pointer]
      if (!snap) {
          dispatch(resetShouldTriggerUpdate())
          return
      }   

      batch(() => {
          dispatch(setSegmentsFromHistory(snap.transcript.segments))
          dispatch(setSpeakersFromHistory(snap.transcript.speaker_tags))
          dispatch(setSegmentTagsFromHistory(snap.transcript.segment_tags))
          dispatch(setRegion2IDFromHistory(snap.transcript.region2ID))
          dispatch(setGroupingFromHistory(snap.grouping))   

          //    Mappinh speakerID to colors 
          const snapshotColorMap: Record<string,string> = {}
          snap.transcript.speaker_tags.forEach(tag => {
              snapshotColorMap[tag.id] = tag.color
          })    
        
          waveformRegionsRef.current.getRegions().forEach(region => {
              const segID = snap.transcript.region2ID[region.id]
              if (!segID) return
              const seg = snap.transcript.segments.entities[segID]
              if (!seg) return
              const col = rgba(snapshotColorMap[seg.speaker] || "#000000", 0.4)
              region.setOptions({ color: col })
          })    
        
          dispatch(resetShouldTriggerUpdate())
    })
    }, [shouldTriggerUpdate, history.snapshots, history.pointer, dispatch, waveformRegionsRef])
}
