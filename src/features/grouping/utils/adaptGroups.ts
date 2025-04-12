// types
import { Lookup } from "../../../types/Lookup";
import { Group, GroupLoadingParams } from "../types/Group";
import { Segment } from "../../transcript/types/Segment";

// utils
import { v4 as uuid } from 'uuid'
import { addGroupToSegmentMapping } from "./segment2GroupManipulations";


const time2SegmentID = (time: number, segments: Lookup<Segment>, type: "start"|"end"): string => {
    const tolerance = 0.00001;
    
    // Find the closest match within tolerated boundaries..
    return segments.keys.reduce((closestId, currentId) => {
        const current = segments.entities[currentId];
        const currentDiff = Math.abs(current[type] - time);
        const closestDiff = closestId ? Math.abs(segments.entities[closestId][type] - time) : Infinity;
        
        return currentDiff < tolerance && currentDiff < closestDiff ? currentId : closestId;
    }, "");
};

const adaptGroup = (group: GroupLoadingParams, entities: Record<string, Group>, segments: Lookup<Segment>, parentID: string|undefined): string => {
    const { start, end, children, ...GroupCommon } = group;
    const id = group.id || uuid();

    // Find segments within tolerance (0.001 seconds)
    const startSegments = Object.values(segments.entities).filter(s => 
        Math.abs(s.start - start) < 0.001
    );
    
    const endSegments = Object.values(segments.entities).filter(s => 
        Math.abs(s.end - end) < 0.001
    );

    if (startSegments.length === 0 || endSegments.length === 0) {
        console.error("Boundary segments not found for group", {
            group,
            startSegments,
            endSegments
        });
        return "";
    }

    // Take the first match 
    const startSegmentID = startSegments[0].id;
    const endSegmentID = endSegments[0].id;
    if (!startSegmentID || !endSegmentID) return "";

    const transformedGroup: Group = {
        ...GroupCommon,
        id,
        startSegmentID,
        endSegmentID,
        parentID,
        childrenIDs: adaptGroupArr(children, entities, segments, id)
    };

    entities[id] = transformedGroup;
    return id;
};


const adaptGroupArr = (groupArr: GroupLoadingParams[], entities: Record<string, Group>, segments: Lookup<Segment>, parentID: string|undefined): string[] => {
    return groupArr
        .map(rawGroup => adaptGroup(rawGroup, entities, segments, parentID))
        .filter(id => id !== "") // Filtering out invalid groups
}

export const adaptGroups = (groups: GroupLoadingParams[]|null|undefined, segments: Lookup<Segment>) => {
    const transformedGroups: Lookup<Group> = { keys: [], entities: {}, }
    
    // console.log("complete print groups:", groups, "segments:", segments, "transformed groups:", transformedGroups)

    if (!groups)   
        return {transformedGroups: transformedGroups, startSegment2Group: {}, endSegment2Group: {}}

    

    transformedGroups.keys = adaptGroupArr(groups, transformedGroups.entities, segments, undefined)

    const startSegment2Group: Record<string, string[]> = {}
    const endSegment2Group: Record<string, string[]> = {}
    for (let groupID in transformedGroups.entities){
        const group = transformedGroups.entities[groupID]
        addGroupToSegmentMapping(startSegment2Group, group.startSegmentID, groupID)
        addGroupToSegmentMapping(endSegment2Group, group.endSegmentID, groupID)
    }

    console.log("Calling adaptGroups with groups:", JSON.stringify(groups), "segments:", JSON.stringify(segments));

    if (!groups || groups.length === 0) {
        console.warn("No groups available, keeping existing state.");
        return { transformedGroups, startSegment2Group, endSegment2Group };
    }
    


    return {transformedGroups: transformedGroups, startSegment2Group: startSegment2Group, endSegment2Group: endSegment2Group}
}
