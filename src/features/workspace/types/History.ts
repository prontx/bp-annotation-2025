import { Lookup } from "../../../types/Lookup"
import { Group } from "../../grouping/types/Group"
import { Segment } from "../../transcript/types/Segment"
import { SpeakerTag, SegmentTag } from "../../transcript/types/Tag"

export interface Snapshot {
    transcript: {
        segments: Lookup<Segment>,
        speaker_tags: SpeakerTag[],
        segment_tags: SegmentTag[],
    },
    grouping: {
        startSegment2Group: Record<string, string[]>,
        endSegment2Group: Record<string, string[]>,
        groups: Lookup<Group>
    },
}

export interface History {
    enable: boolean,
    shouldTriggerUpdate: boolean,
    pointer: number,
    snapshots: Snapshot[],
}
