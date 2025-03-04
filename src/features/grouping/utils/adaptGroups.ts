// types
import { Lookup } from "../../../types/Lookup";
import { Group, GroupLoadingParams } from "../types/Group";
import { Segment } from "../../transcript/types/Segment";

// utils
import { v4 as uuid } from 'uuid'
import { addGroupToSegmentMapping } from "./segment2GroupManipulations";


const time2SegmentID = (time: number, segments: Lookup<Segment>, type: "start"|"end"): string => {
    const tolerance = 0.00001 
    
    return segments.keys.find(key => {
        const segment = segments.entities[key]
        return Math.abs(segment[type] - time) < tolerance
    }) || ""
}   


const adaptGroup = (group: GroupLoadingParams, entities: Record<string, Group>, segments: Lookup<Segment>, parentID: string|undefined): string => {
    const { start, end, children, ...GroupCommon } = group;
    const id = uuid();

    // const startSegmentID = time2SegmentID(start, segments, "start");
    // const endSegmentID = time2SegmentID(end, segments, "end");

    

    //  // Adding validation
    //  if (!startSegmentID || !endSegmentID) {
    //     console.warn(`Skipping invalid group with missing segments (start: ${startSegmentID}, end: ${endSegmentID})`)
    //     return "" // Return empty ID to skip
    // }

    const startSegmentID = time2SegmentID(start, segments, "start") || segments.keys[0]; // Fallback to the first segment
    const endSegmentID = time2SegmentID(end, segments, "end") || segments.keys[segments.keys.length - 1]; // Fallback to the last segment


    if (!startSegmentID && !endSegmentID) {
        console.warn(`Skipping invalid group with missing both start and end segments (start: ${startSegmentID}, end: ${endSegmentID})`);
        return ""; // Only deleting the group if both start & end are missing
    }
    


    const transformedGroup: Group = {
        ...GroupCommon,
        id: id,
        startSegmentID: startSegmentID, 
        endSegmentID: endSegmentID,
        parentID: parentID,
        childrenIDs: adaptGroupArr(children, entities, segments, id)
    };

    entities[id] = transformedGroup;
    return id;
}


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
