import { Lookup } from "../../../types/Lookup"
import { Group } from "./Group"

export interface GroupingState {
    isEditing: boolean,
    selecting: "start"|"end"|null,
    selectedSegmentIDs: {
        start: string,
        end: string,
    },
    parentSegmentIDs: {
        start: string,
        end: string,
    },
    groups: Lookup<Group>,
    startSegment2Group: Record<string, string[]>,
    endSegment2Group: Record<string, string[]>,
}
