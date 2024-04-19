import { SpeakerTag } from "./Tag"
import { SegmentTag, TextTag } from "./Tag";
import { Segment, SegmentLoadingParams } from "./Segment";
import { Lookup } from "../../../types/Lookup";

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

export interface Transcript extends TranscriptCommon {
    segments: Lookup<Segment>,
    region2ID: Record<string, string>,
    specialChar: string,
    lastFocusedSegment: string,
}
