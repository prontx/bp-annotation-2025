import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'

// style
import { speakerColors } from '../../../style/tagColors'

// types
import { Job } from "../types/Job"
import { RootState } from '../../../redux/store'
import { GroupTag, SpeakerTag } from '../../transcript/types/Tag'
import { APIErrorResponse } from '../../../types/APIErrorResponse'

// utils
import axios from "../../../utils/getAxios"

// testing
import { JOB_ID } from '../../../testing/test.config'
import test_groups from "../../../testing/metadata.json"


export const fetchJob = createAsyncThunk("job", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get<Job>(JOB_ID)
        return data
    } catch (err) {
        if (!(err instanceof Error && "response" in err && err.response instanceof Object && "data" in err.response)){
            throw {code: 400, message: "Unknown error."}
        }
        throw rejectWithValue(err.response.data);
    }
})

// initial state of the slice
const initialState: Job = {
    id: "",
    title: "",
    description: "",
    category: "",
    transcription: "",
    status: "idle",
    status_message: "",
    duration: 0,
    created_at: "",
    recorded_at: "",
    processed_at: "",
    updated_at: "",
    accessed_at: "",
    url: {
        thumbnail: "",
        waveform: "",
        mp3: "",
        transcript: "",
    },
    pipeline: {
        id: "",
        tasks: null,
    },
    user_interface: null
}

export const jobSlice = createSlice({
    name: 'job',
    initialState,
    reducers: {
        // TODO: add reducers
    },
    extraReducers(builder) {
        builder.addCase(fetchJob.pending, (state, _) => {
            state.status = "loading"
        }).addCase(fetchJob.fulfilled, (state, action) => {
            // @ts-ignore FIXME
            action.payload.user_interface.group_tags = test_groups
            const transformedTags: SpeakerTag[] = []
            for (const [index, tag] of action.payload.user_interface?.speaker_tags?.entries() || []){
                if (!tag.label)
                    continue
                
                if (!tag.color){
                    tag.color = speakerColors[index % speakerColors.length]
                }
                transformedTags.push(tag)
            }
            if (action.payload.user_interface){
                action.payload.user_interface.speaker_tags = transformedTags
            }
            return {...state, ...action.payload}
        }).addCase(fetchJob.rejected, (state, action) => {
            state.status = "error"
            state.status_message = (action.payload as APIErrorResponse).message
        })
    }
})

export const {  } = jobSlice.actions

export const selectJob = (state: RootState) => state.job
export const selectJobStatus = (state: RootState) => state.job.status
export const selectDuration = (state: RootState) => state.job.duration
export const selectSpeakers = (state: RootState) => state.job.user_interface?.speaker_tags || []
export const selectAudioURL = (state: RootState) => state.job.url.mp3
export const selectSpeaker2Color = (state: RootState) => {
    let mapping: Record<string, string> = {}
    if (!state.job.user_interface || ! state.job.user_interface.speaker_tags)
        return mapping
    state.job.user_interface.speaker_tags.forEach(tag => {
        if (tag.color){
            mapping[tag.id] = tag.color
        }
    })
    return mapping
}
export const selectTagSubcategories = (state: RootState, tag?: string[]) => {
    if (!state.job.user_interface || !state.job.user_interface.group_tags)
        return undefined
    
    let result: GroupTag[] | undefined = state.job.user_interface.group_tags
    for (let i = 0; tag && i < tag.length; i++){
        for (let j = 0; result && j < result.length; j++){
            if (result[j].name === tag[i]){
                result = result[j].subcategories
                break
            }
        }
    }
    return result
}

export default jobSlice.reducer
