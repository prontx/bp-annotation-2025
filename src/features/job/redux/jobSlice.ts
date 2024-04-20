import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'

// style

// types
import { Job } from "../types/Job"
import { RootState } from '../../../redux/store'
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
export const selectAudioURL = (state: RootState) => state.job.url.mp3
export const selectGroupTags = (state: RootState) => {
    if (!state.job.user_interface)
        return undefined
    return state.job.user_interface.group_tags
}
export const selectTitle = (state: RootState) => state.job.title

export default jobSlice.reducer
