// redux
import { createAsyncThunk } from '@reduxjs/toolkit'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// types
import type { Transcript } from "../types/Transcript"
import type { RootState } from '../../../redux/store'
import type { SegmentUpdate } from '../types/Segment';

// utils
import { v4 as uuid } from 'uuid';

// testing
import { mockTranscriptRequest } from '../../../testing/mockAPI'


export const fetchTranscript = createAsyncThunk("transcript", async (): Promise<Transcript> => {
    const data: Transcript = await mockTranscriptRequest()
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
        updateSegment: (state, action: PayloadAction<SegmentUpdate>) => {
            if (!state.segments)
                return

            const idx = state.segments.findIndex(segment => segment.id === action.payload.id)
            if (idx >= 0 && idx < state.segments.length){
                state.segments[idx] = {...state.segments[idx], ...action.payload}
            }
        },
        deleteSegment: (state, action: PayloadAction<{id: string}>) => {
            if (!state.segments)
                return
        
            const idx = state.segments.findIndex(segment => segment.id === action.payload.id)
            if (idx >= 0){
                state.segments.splice(idx, 1)
            }
        },
        mergeSegment: (state, action: PayloadAction<{id: string}>) => {
            console.log("> mergeSegment from slice")
            // TODO: implement
        }
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
            state.segments = action.payload.segments?.map(segment => {
                return {...segment, id: uuid()}
            }) || null
        }).addCase(fetchTranscript.rejected, (state, _) => {
            state.status = "error"
            // TODO: handle error message
        })
    }
})

export const { updateSegment, deleteSegment, mergeSegment } = transcriptSlice.actions

export const selectTranscript = (state: RootState) => state.transcript
export const selectTranscriptStatus = (state: RootState) => state.transcript.status
export const selectSegments = (state: RootState) => state.transcript.segments
export const selectSegmentById = (state: RootState, id: string) => {
    return state.transcript.segments?.find(segment => segment.id === id) || null
}

export default transcriptSlice.reducer
