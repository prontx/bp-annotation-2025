import { Lookup } from "../../../types/Lookup";
import { Segment, SegmentLoadingParams } from "../../transcript/types/Segment";
import { string2SegmentWords } from "../../../utils/segmentWords2String";


export const adaptSegments = (segments: Lookup<Segment>): SegmentLoadingParams[] => {
    let segmentArr: SegmentLoadingParams[] = []
    segments.keys.forEach(key => {
        const localSegment = segments.entities[key] 
        segmentArr.push({
            ...localSegment,
            words: string2SegmentWords(localSegment.words),
        })
    })
    return segmentArr
}
