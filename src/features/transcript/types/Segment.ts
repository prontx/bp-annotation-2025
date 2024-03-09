import { Word } from "./Word"


export interface Segment {
    regionID?: string,
    start: number,
    end: number
    speaker: string,
    language: string|null,
    segment_tags: string[],
    words: Word[]|null
}
