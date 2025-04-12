import { Lookup } from "../../../types/Lookup";
import { Group } from "../../grouping/types/Group";
import { Segment } from "../types/Segment";

// I'll use this to fetch the current group start/end timestamps as the previous mechanism
// wasn't quite working for cooperative writing. 
export const getGroupTimes = (group: Group, segments: Lookup<Segment>) => {
    try {
        const startSegment = segments.entities[group.startSegmentID];
        const endSegment = segments.entities[group.endSegmentID];
        
        if (!startSegment || !endSegment) {
            throw new Error(`Missing boundary segments for group ${group.id}`);
        }

        return {
            start: startSegment.start,
            end: endSegment.end
        };
    } catch (error) {
        console.error("Error getting group times:", error);
        return { start: 0, end: 0 };
    }
};