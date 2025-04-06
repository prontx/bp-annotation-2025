// types
import { Lookup } from "../../../types/Lookup";
import { Group, GroupLoadingParams } from "../types/Group";
import { Segment } from "../../transcript/types/Segment";

// utils
import { v4 as uuid } from 'uuid'
import { addGroupToSegmentMapping } from "./segment2GroupManipulations";


interface GroupConversionConfig {
    segments: Lookup<Segment>;
    strictMode?: boolean;
}

const TIME_TOLERANCE = 0.01; // 10ms tolerance for timestamp matching

export const convertGroupsForBackend = (
    frontendGroups: Lookup<Group>,
    segments: Lookup<Segment>,
    strictMode: boolean = false
): GroupLoadingParams[] => {
    const backendGroups: GroupLoadingParams[] = [];
    if (!frontendGroups || !frontendGroups.keys) return [];
    
    frontendGroups.keys.forEach(groupId => {
        const group = frontendGroups.entities[groupId];
        const startSegment = segments.entities[group.startSegmentID];
        const endSegment = segments.entities[group.endSegmentID];

        if (!startSegment || !endSegment) {
            if (strictMode) {
                console.error(`Missing segments for group ${groupId}`);
                return;
            }
            console.warn(`Group ${groupId} has invalid segments, preserving with fallback`);
        }

        backendGroups.push({
            title: group.title,
            publish: group.publish,
            tags: group.tags,
            start: startSegment?.start || 0,
            end: endSegment?.end || 0,
            children: convertGroupsForBackend(
                { 
                    keys: group.childrenIDs,
                    entities: frontendGroups.entities
                }, 
                segments,
                strictMode
            )
        });
    });

    return backendGroups;
};





export const adaptGroups = (
    backendGroups: GroupLoadingParams[] | null | undefined,
    segments: Lookup<Segment>
) => {
    const result = {
        transformedGroups: { keys: [], entities: {} } as Lookup<Group>,
        startSegment2Group: {} as Record<string, string[]>,
        endSegment2Group: {} as Record<string, string[]>
    };

    backendGroups?.forEach(backendGroup => {
        // Validate required fields first
        if (!backendGroup.startSegmentID || !backendGroup.endSegmentID) {
            console.warn(`Skipping group "${backendGroup.title}" - missing segment IDs`);
            return;
        }

        const id = uuid();
        const startSegmentID = backendGroup.startSegmentID;
        const endSegmentID = backendGroup.endSegmentID;

        // Validate segment existence
        if (!segments.entities[startSegmentID] || !segments.entities[endSegmentID]) {
            console.warn(`Skipping group "${backendGroup.title}" - invalid segment references`);
            return;
        }

        const group: Group = {
            id,
            title: backendGroup.title,
            startSegmentID,
            endSegmentID,
            publish: backendGroup.publish,
            tags: backendGroup.tags,
            childrenIDs: backendGroup.childrenIDs || []
        };

        result.transformedGroups.keys.push(id);
        result.transformedGroups.entities[id] = group;
        
        // Safe to use non-null assertion here after validation
        (result.startSegment2Group[startSegmentID!] ??= []).push(id);
        (result.endSegment2Group[endSegmentID!] ??= []).push(id);
    });

    return result;
};


