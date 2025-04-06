import { Word } from "./Word"

interface SegmentCommon {
    id?: string;  // Add optional ID
    start: number,
    end: number,
    speaker: string,
    language: string|null,
    segment_tags: string[],
}

export interface SegmentLoadingParams extends SegmentCommon {
    words: Word[]|null,
}

export interface Segment extends SegmentCommon {
    words: string,
}
