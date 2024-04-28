import { GroupTag } from "../../transcript/types/Tag";

interface GroupCommon {
    title?: string,
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
