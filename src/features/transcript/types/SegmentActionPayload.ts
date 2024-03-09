import { Segment } from "./Segment"


export interface SegmentCreationPayload {
    regionID: string,
    start: number,
    end: number
}

export interface SegmentUpdateOptions {
    start: number,
    end?: number,
    color?: string
}

export interface SegmentUpdatePayload {
    type: "id" | "region",
    key: string,
    change: Partial<Segment>
    callback?: (regionID: string, options: SegmentUpdateOptions) => void
}
