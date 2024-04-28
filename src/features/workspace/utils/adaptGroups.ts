import { Lookup } from "../../../types/Lookup"
import { Group, GroupLoadingParams } from "../../grouping/types/Group"
import { Segment } from "../../transcript/types/Segment"


const adaptGroup = (groupID: string, groups: Lookup<Group>, segments: Lookup<Segment>): GroupLoadingParams => {
    const {id, startSegmentID, endSegmentID, parentID, childrenIDs, ...commonWithGroupLoadingParams} = groups.entities[groupID]
    let childrenArr: GroupLoadingParams[] = childrenIDs.map(childID => 
        adaptGroup(childID, groups, segments)
    )
    return {
        ...commonWithGroupLoadingParams,
        start: segments.entities[startSegmentID].start,
        end: segments.entities[endSegmentID].end,
        children: childrenArr,
    }
}

export const adaptGroups = (groups: Lookup<Group>, segments: Lookup<Segment>): GroupLoadingParams[] => {
    let groupArr: GroupLoadingParams[] = []
    for (const key of groups.keys){
        const {parentID} = groups.entities[key]
        if (!parentID){
            groupArr.push(adaptGroup(key, groups, segments))
        }
    }
    return groupArr
}
