import { Lookup } from "../../../types/Lookup"
import { Group } from "../../grouping/types/Group"
import { Segment } from "../../transcript/types/Segment"
import { SpeakerTag } from "../../transcript/types/Tag"

export interface Snapshot {
    transcript: {
        segments: Lookup<Segment>,
        speaker_tags: SpeakerTag[],
    },
    grouping: {
        groups: Lookup<Group>
    },
}

export interface History {
    shouldTriggerUpdate: boolean,
    pointer: number,
    snapshots: Snapshot[],
}
