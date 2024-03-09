import { SegmentTag, SpeakerTag, TextTag } from "../../transcript/types/Tag"

interface DocumentTag {
    id: string,
    label: string
}

interface Link {
    url: string,
    title: string
}

interface View {
    url?: string,
    text?: string,
    title: string,
    type: string
}

interface JobUserInterface {
    document_tags?: DocumentTag[],
    speaker_tags?: SpeakerTag[],
    segment_tags?: SegmentTag[],
    text_tags?: TextTag[],
    links?: Link[],
    views?: View[]
}

// interface PipelineTask {
//     id: string,
//     settings: {},
//     output?: {}
// }

export interface Job {
    id: string,
    title: string,
    description: string,
    category: string,
    transcription: string,
    status: string,
    status_message: string,
    duration: number,
    created_at: string|null,
    recorded_at: string|null,
    processed_at: string|null,
    updated_at: string|null,
    accessed_at: string|null,
    url: {
        thumbnail: string,
        waveform: string,
        mp3: string,
        transcript: string,
    },
    pipeline: {
        id: string,
        tasks: unknown[]|null,
    },
    user_interface: JobUserInterface|null
}
