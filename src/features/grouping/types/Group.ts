export interface Group {
    id: string,
    title: string,
    startSegmentID: string,
    endSegmentID: string,
    publish: boolean,
    tags: string[],
    parentID?: string,
    childrenIDs: string[]
}
