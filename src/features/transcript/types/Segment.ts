import { Word } from "./Word"

export interface Segment {
    start: number,
    end: number,
    speaker: string,
    language: string|null,
    segment_tags: string[],
    words: Word[]|null
}
