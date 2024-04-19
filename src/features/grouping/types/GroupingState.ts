import { Lookup } from "../../../types/Lookup"
import { Group } from "./Group"

export interface GroupingState {
    isEditing: boolean,
    selecting: "start"|"end"|null,
    selected: {
        startSegmentID: string,
        endSegmentID: string,
    },
    parentStartSegmentID: string,
    parentEndSegmentID: string,
    groups: Lookup<Group>,
}
