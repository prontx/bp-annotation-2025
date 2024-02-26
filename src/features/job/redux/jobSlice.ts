import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { mockJobRequest } from '../../../testing/mockAPI'

// types
import { Job } from "../types/Job"
import { RootState } from '../../../redux/store'


export const fetchJob = createAsyncThunk("job", async () => {
    const data = await mockJobRequest()
    return data
})

// initial state of the slice
const initialState: Job = {
    id: "",
    title: "",
    description: "",
    category: "",
    transcription: "",
    status: "",
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
            state.id = action.payload.id
            state.title = action.payload.title
            state.description = action.payload.description
            state.category = action.payload.category
            state.transcription = action.payload.transcription
            state.status = action.payload.status
            state.status_message = action.payload.status_message
            state.duration = action.payload.duration
            state.created_at = action.payload.created_at
            state.recorded_at = action.payload.recorded_at
            state.processed_at = action.payload.processed_at
            state.updated_at = action.payload.updated_at
            state.accessed_at = action.payload.accessed_at
            state.url = action.payload.url
            state.pipeline = action.payload.pipeline
            state.user_interface = action.payload.user_interface
        }).addCase(fetchJob.rejected, (state, action) => {
            state.status = "error"
            state.status_message = action.payload as string
            // TODO: check if action.payload is error message or some object
        })
    }
})

export const {  } = jobSlice.actions

export const selectJob = (state: RootState) => state.job
export const selectJobStatus = (state: RootState) => state.job.status

export default jobSlice.reducer

