import { GroupTag } from "../../transcript/types/Tag";

export interface Group {
    id: string,
    title?: string,
    startSegmentID: string,
    endSegmentID: string,
    publish: boolean,
    tags: GroupTag[],
    parentID?: string,
    childrenIDs: string[]
}
