// types
import { Lookup } from "../../../types/Lookup";
import { Group, GroupLoadingParams } from "../types/Group";
import { Segment } from "../../transcript/types/Segment";

// utils
import { v4 as uuid } from 'uuid'


const time2SegmentID = (time: number, segments: Lookup<Segment>, type: "start"|"end"): string => {
    const segmentID = segments.keys.find(key => {
        segments.entities[key][type] === time // FIXME: float comparison
    })

    if (!segmentID)
        return ""
    return segmentID
}

const adaptGroup = (group: GroupLoadingParams, entities: Record<string, Group>, segments: Lookup<Segment>, parentID: string|undefined): string => {
    const {start, end, children, ...GroupCommon} = group
    const id = uuid()
    const transformedGroup: Group = {
        ...GroupCommon,
        id: id,
        startSegmentID: time2SegmentID(start, segments, "start"),
        endSegmentID: time2SegmentID(end, segments, "end"),
        parentID: parentID,
        childrenIDs: adaptGroupArr(children, entities, segments, id)
    }
    entities[id] = transformedGroup
    return id
}

const adaptGroupArr = (groupArr: GroupLoadingParams[], entities: Record<string, Group>, segments: Lookup<Segment>, parentID: string|undefined): string[] => {
    let IDs: string[] = []
    groupArr.forEach(rawGroup => {
        const id = adaptGroup(rawGroup, entities, segments, parentID)
        IDs.push(id)
    })
    return IDs
}

export const adaptGroups = (groups: GroupLoadingParams[]|null|undefined, segments: Lookup<Segment>): Lookup<Group> => {
    const transformedGroups: Lookup<Group> = { keys: [], entities: {}, }
    if (!groups)   
        return transformedGroups

    transformedGroups.keys = adaptGroupArr(groups, transformedGroups.entities, segments, undefined)

    // TODO: {start|end}Segment2Group
    return transformedGroups
}
