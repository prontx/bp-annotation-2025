import { Segment } from "./Segment"


export interface SegmentCreationPayload {
    regionID: string,
    start: number,
    end: number
}

export interface SegmentUpdatePayload {
    type: "id" | "region",
    key: string,
    change: Partial<Segment>
}
