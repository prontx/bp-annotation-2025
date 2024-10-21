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
        const segment: Segment = {
            ...segmentRaw,
            start: Number(segmentRaw.start.toFixed(1)),
            end: Number(segmentRaw.end.toFixed(1)),
            words: segmentWords2String(segmentRaw.words),
        }
        const id = uuid()
        transformedSegments.keys.push(id)
        transformedSegments.entities[id] = segment
    })
    return transformedSegments
}
