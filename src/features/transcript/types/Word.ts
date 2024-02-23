export interface Word {
    label: string,
    start?: number|null,
    end?: number|null,
    confidence?: number|null,
    text_tags: string[]
}
