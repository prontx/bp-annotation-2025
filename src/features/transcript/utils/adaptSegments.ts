import { Lookup } from "../../../types/Lookup"
import { Segment, SegmentLoadingParams } from "../types/Segment"
import { segmentWords2String } from "../../../utils/segmentWords2String"
import { v4 as uuid } from 'uuid'

export const adaptSegments = (segments: SegmentLoadingParams[]|null|undefined) => {
    const transformedSegments: Lookup<Segment> = {
        keys: [],
        entities: {},
    }
    
    segments?.forEach(segmentRaw => {
        // If UUID isn't provided, I'll generate my own one.. 
        const id = segmentRaw.id || `seg-${segmentRaw.start}-${segmentRaw.end}`;
        
        const segment: Segment = {
            ...segmentRaw,
            id,
            start: Number(segmentRaw.start.toFixed(3)), // More precise rounding
            end: Number(segmentRaw.end.toFixed(3)),
            words: segmentWords2String(segmentRaw.words),
        }
        
        transformedSegments.keys.push(id)
        transformedSegments.entities[id] = segment
    })
    
    return transformedSegments
}
