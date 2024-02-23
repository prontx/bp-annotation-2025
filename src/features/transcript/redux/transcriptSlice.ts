import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { mockTranscriptRequest } from '../../../testing/mock_api'

// types
import { Transcript } from "../types/Transcript"
import { RootState } from '../../../redux/store'


export const fetchTranscript = createAsyncThunk("transcript", async () => {
    const data = await mockTranscriptRequest()
    return data
})

const initialState: Transcript = {
    id: "",
    status: "idle",
    source: "",
    created_at: "",
    speaker_tags: null,
    segments: null
}

export const transcriptSlice = createSlice({
    name: 'transcript',
    initialState,
    reducers: {
        // TODO: add reducers
    },
    extraReducers(builder) {
        builder.addCase(fetchTranscript.pending, (state, _) => {
            state.status = "loading"
        }).addCase(fetchTranscript.fulfilled, (state, action) => {
            state.status = "success"
            state.id = action.payload.id,
            state.source = action.payload.source,
            state.created_at = action.payload.created_at
            state.speaker_tags = action.payload.speaker_tags
            state.text_tags = action.payload.text_tags
            state.segment_tags = action.payload.segment_tags
            state.segments = action.payload.segments
        }).addCase(fetchTranscript.rejected, (state, _) => {
            state.status = "error"
            // TODO: handle error message
        })
    }
})

export const {  } = transcriptSlice.actions

export const selectTranscript = (state: RootState) => state.transcript
export const selectTranscriptStatus = (state: RootState) => state.transcript.status
export const selectSegments = (state: RootState) => state.transcript.segments

export default transcriptSlice.reducer

