import { Word } from "./Word"

export interface Segment {
    id?: string,
    start: number,
    end: number,
    speaker: string,
    language: string|null,
    segment_tags: string[],
    words: Word[]|null
}

export interface SegmentUpdate {
    id: string,
    start?: number,
    end?: number,
    speaker?: string,
    language?: string|null,
    segment_tags?: string[],
    words?: Word[]|null
}
