// types
import { Lookup } from "../../../types/Lookup";
import { Group, GroupLoadingParams } from "../types/Group";
import { Segment } from "../../transcript/types/Segment";

// utils
import { v4 as uuid } from 'uuid'
import { addGroupToSegmentMapping } from "./segment2GroupManipulations";


const time2SegmentID = (time: number, segments: Lookup<Segment>, type: "start"|"end"): string => {
    const tolerance = 0.05; // Increase tolerance if necessary to accommodate boundary cases.
    
    // Find the segment that starts or ends close to the desired time
    const segmentID = segments.keys.find(key => {
        const segment = segments.entities[key];
        console.log(`Checking segment ${key}:`, segment);
        const difference = Math.abs(segment[type] - time);
        
        // Match the segment if the difference is within tolerance or if it's the exact segment we want.
        return difference < tolerance || segment[type] === time;
    });

    console.log(`Mapping time ${time} to segment ID:`, segmentID || "No match found");
    return segmentID || ""; // If no match, return empty string.
}


const adaptGroup = (group: GroupLoadingParams, entities: Record<string, Group>, segments: Lookup<Segment>, parentID: string|undefined): string => {
    const { start, end, children, ...GroupCommon } = group;
    const id = uuid();

    const startSegmentID = time2SegmentID(start, segments, "start");
    const endSegmentID = time2SegmentID(end, segments, "end");

    // Check if the start/end segment IDs are valid before creating the group
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
    let IDs: string[] = []
    groupArr.forEach(rawGroup => {
        const id = adaptGroup(rawGroup, entities, segments, parentID)
        IDs.push(id)
    })
    return IDs
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

    console.log("Groups have been changed: " + JSON.stringify(transformedGroups))

    return {transformedGroups: transformedGroups, startSegment2Group: startSegment2Group, endSegment2Group: endSegment2Group}
}
