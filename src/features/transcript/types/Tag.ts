export interface SpeakerTag {
    id: string,
    label: string,
    likelihood?: number,
    color?: string
}

export interface SegmentTag {
    id: string,
    label: string,
    color?: string
}

export interface TextTag {
    label: string,
    title: string,
    color?: string
}
