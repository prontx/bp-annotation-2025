import { useEffect, useState } from "react"

// redux
import { useSelector } from "react-redux"
import { selectIsEditing, selectSelecting, selectStartEndSegmentIDs } from "../redux/groupingSlice"


export const useSelectingStartEnd = (segmentIDs: string[], hoverID: string) => {
    const selecting = useSelector(selectSelecting)
    const isEditing = useSelector(selectIsEditing)
    const [startIdx, setStartIdx] = useState(-1)
    const [endIdx, setEndIdx] = useState(-1)
    const [hoverIdx, setHoverIdx] = useState(-1)
    const {start: startSegmentID, end: endSegmentID} = useSelector(selectStartEndSegmentIDs)

    useEffect(() => { // find hoverIdx when selecting
        if (!selecting)
            return
        setHoverIdx(segmentIDs.findIndex(id => id === hoverID))
    }, [selecting, segmentIDs, hoverID])
    
    useEffect(() => {
        if (!selecting && !isEditing){
            setStartIdx(-1)
            setEndIdx(-1)
            setHoverIdx(-1)
            return
        }

        if (startSegmentID){
            setStartIdx(segmentIDs.findIndex(id => id === startSegmentID))
        } else if (hoverID){
            setStartIdx(segmentIDs.findIndex(id => id === hoverID))
        }
        if (endSegmentID){
            setEndIdx(segmentIDs.findIndex(id => id === endSegmentID))
        } else if (hoverID){
            setEndIdx(segmentIDs.findIndex(id => id === hoverID))
        } 
    }, [segmentIDs, selecting, isEditing, hoverIdx, startSegmentID, endSegmentID])

    return [startIdx, endIdx]
}
