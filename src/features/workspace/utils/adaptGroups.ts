import { Lookup } from "../../../types/Lookup"
import { Group, GroupLoadingParams } from "../../grouping/types/Group"
import { Segment } from "../../transcript/types/Segment"


const adaptGroup = (groupID: string, groups: Lookup<Group>, segments: Lookup<Segment>): GroupLoadingParams => {
    const { id, startSegmentID, endSegmentID, parentID, childrenIDs, ...commonWithGroupLoadingParams } = groups.entities[groupID];
    
    let childrenArr: GroupLoadingParams[] = childrenIDs.map(childID => 
        adaptGroup(childID, groups, segments)
    );

    const startSegment = segments.entities[startSegmentID];
    const endSegment = segments.entities[endSegmentID];

    return {
        ...commonWithGroupLoadingParams,
        start: startSegment?.start || 0, // Provide a default value (e.g., 0) if undefined
        end: endSegment?.end || 0,       // Provide a default value (e.g., 0) if undefined
        children: childrenArr,
    };
};


export const adaptGroups = (groups: Lookup<Group>, segments: Lookup<Segment>): GroupLoadingParams[] => {
    let groupArr: GroupLoadingParams[] = []
    if(groups && groups.keys) {
        for (const key of groups.keys){
            const {parentID} = groups.entities[key]
            if (!parentID){ 
                groupArr.push(adaptGroup(key, groups, segments))
                console.log(groupArr)
            }
            // this was causing an undefined var error
        }
        return groupArr
    }
    return groupArr
}
