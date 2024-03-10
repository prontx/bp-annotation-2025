export interface Group {
    id: string,
    title: string,
    startSegmentID: string,
    endSegmentID: string,
    tags: string[],
    childrenIDs?: string[]
}