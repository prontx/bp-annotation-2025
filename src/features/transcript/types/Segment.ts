import { Word } from "./Word"

interface SegmentCommon {
    start: number,
    end: number,
    speaker: string,
    language: string|null,
    segment_tags: string[],
}

export interface SegmentLoadingParams extends SegmentCommon {
    id?: string;
    words: Word[]|null,
}

export interface Segment extends SegmentCommon {
    words: string,
    id?: string;
}
