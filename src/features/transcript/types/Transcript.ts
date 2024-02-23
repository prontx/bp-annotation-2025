import { SpeakerTag } from "./SpeakerTag"
import { SegmentTag } from "./SegmentTag";
import { Segment } from "./Segment";
import { TextTag } from "./TextTag";

export interface Transcript {
    id: string,
    status?: string,
    source: string,
    created_at: string,
    speaker_tags: SpeakerTag[]|null,
    segment_tags?: SegmentTag[]|null,
    text_tags?: TextTag[]|null,
    segments: Segment[]|null
}
