import { Lookup } from "../../../types/Lookup"
import { Segment, SegmentLoadingParams } from "../types/Segment"
import { segmentWords2String } from "../../../utils/segmentWords2String"
import { v4 as uuid } from 'uuid'


export const adaptSegments = (segments: SegmentLoadingParams[] | null | undefined): Lookup<Segment> => {
    const transformed: Lookup<Segment> = { keys: [], entities: {} };
    
    segments?.forEach(segment => {
        // Preserve original ID or generate new one
        const id = segment.id || uuid();
        
        transformed.entities[id] = {
            ...segment,
            id,
            words: segmentWords2String(segment.words),
            start: Number(segment.start.toFixed(1)),
            end: Number(segment.end.toFixed(1))
        };
        transformed.keys.push(id);
    });
    
    return transformed;
};