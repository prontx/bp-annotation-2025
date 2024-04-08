import { useEffect, useState } from "react"

// redux
import { useSelector } from "react-redux"
import { selectSegmentIDs } from "../redux/transcriptSlice"
import { selectStartEndParentSegmentID } from "../../grouping/redux/groupingSlice"


export const useSelectSegmentIDs = (): string[] => {
    const segmentIDs = useSelector(selectSegmentIDs)
    const [parentStartSegmentID, parentEndSegmentID] = useSelector(selectStartEndParentSegmentID)
    const [filtered, setFiltered] = useState<string[]>([])

    useEffect(() => {
        if (!parentStartSegmentID || !parentEndSegmentID){
            setFiltered(segmentIDs)
            return
        }
        const startIdx = segmentIDs.findIndex(id => id === parentStartSegmentID)
        const endIdx = segmentIDs.findIndex(id => id === parentEndSegmentID)
        setFiltered(segmentIDs.slice(startIdx, endIdx + 1))
    }, [segmentIDs, parentStartSegmentID, parentEndSegmentID])

    return filtered
}
