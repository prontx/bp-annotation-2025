import { SpeakerTag } from "./Tag"
import { SegmentTag, TextTag } from "./Tag";
import { Segment, SegmentLoadingParams } from "./Segment";

interface TranscriptCommon {
    id: string,
    status?: string,
    source: string,
    created_at: string,
    speaker_tags: SpeakerTag[] | null,
    segment_tags?: SegmentTag[] | null,
    text_tags?: TextTag[] | null,
}

export interface TranscriptLoadingParams extends TranscriptCommon {
    segments: SegmentLoadingParams[] | null,
}

export interface SegmentStorage {
    keys: string[],
    region2ID: { [key: string]: string },
    entities: { [key: string]: Segment },
}

export interface Transcript extends TranscriptCommon {
    segments: SegmentStorage,
    specialChar: string,
    lastFocusedSegment: string,
}
