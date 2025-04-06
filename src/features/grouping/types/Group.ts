import { GroupTag } from "../../transcript/types/Tag";

interface GroupCommon {
    title?: string,
    start_segment_i_d?: string;
    end_segment_i_d?: string;
    children_i_ds?: string[];
    startSegmentID?: string;
    endSegmentID?: string;
    childrenIDs?: string[];
    start?: number;
    end?: number;
    publish: boolean,
    tags: GroupTag[],
}

export interface GroupLoadingParams extends GroupCommon {
    start: number,
    end: number,
    children: GroupLoadingParams[],
}

export interface Group extends GroupCommon {
    id: string,
    startSegmentID: string,
    endSegmentID: string,
    parentID?: string,
    childrenIDs: string[]
}
