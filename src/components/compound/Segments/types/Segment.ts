import { Word } from "./Word"

export interface Segment {
    id: number,
    start: number,
    end: number,
    speaker: string,
    language: string|null,
    segment_tags: string[],
    group_tags: string[],
    words: Word[] | null
}
