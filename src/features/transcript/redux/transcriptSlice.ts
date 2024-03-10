// redux
import { createAsyncThunk } from '@reduxjs/toolkit'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// types
import type { Transcript, TranscriptLoadingParams } from "../types/Transcript"
import type { RootState } from '../../../redux/store'
import type { SegmentUpdatePayload, SegmentCreationPayload } from '../types/SegmentActionPayload';

// utils
import { v4 as uuid } from 'uuid';

// testing
import { mockTranscriptRequest } from '../../../testing/mockAPI'


export const fetchTranscript = createAsyncThunk("transcript", async (): Promise<TranscriptLoadingParams> => {
    const data: TranscriptLoadingParams = await mockTranscriptRequest()
    return data
})

const initialState: Transcript = {
    id: "",
    status: "idle",
    source: "",
    created_at: "",
    speaker_tags: null,
    segments: {
        keys: [],
        region2ID: {},
        entities: {}
    }
}

export const transcriptSlice = createSlice({
    name: 'transcript',
    initialState,
    reducers: {
        createSegment: (state, action: PayloadAction<SegmentCreationPayload>) => {
            const idx = state.segments.keys.findIndex((key) => state.segments.entities[key].start > action.payload.start);
            const id = uuid()
            if (idx === -1){
                state.segments.keys.push(id)
            } else {
                state.segments.keys.splice(idx, 0, id);
            }
            state.segments.entities[id] = {
                ...action.payload,
                speaker: "A",
                language: null,
                segment_tags: [],
                words: null
            }
            state.segments.region2ID[action.payload.regionID] = id
        },
        updateSegment: (state, action: PayloadAction<SegmentUpdatePayload>) => {
            let {type, key, change, callback} = action.payload
            let segment = null

            // update entity
            if (type === "region"){
                key = state.segments.region2ID[key]
            }
            if (key){
                segment = state.segments.entities[key]
                state.segments.entities[key] = {...segment, ...change}
            }
            
            // set regionID on region load
            if (change.regionID){
                state.segments.region2ID[change.regionID] = key
            }

            // FIXME: update state.segments.keys order by state.segments.entities[key].start (possibly changed)

            // trigger region update on waveform
            // WARNING: the callbacks must not update the redux state!
            if (callback && segment && segment.regionID){
                callback(segment.regionID, {
                    start: change.start || segment.start,
                    end: change.end
                })
            }
        },
        deleteSegment: (state, action: PayloadAction<{id: string, callback: () => void}>) => {
            const idx = state.segments.keys.findIndex(key => key === action.payload.id)
            if (idx >= 0 && idx < state.segments.keys.length){
                state.segments.keys.splice(idx, 1)
            }
            const {regionID} = state.segments.entities[action.payload.id]
            
            delete state.segments.entities[action.payload.id]
            
            if (regionID){                
                // delete regionID from id lookup
                delete state.segments.region2ID[regionID]
            }

            // reload waveform regions
            // WARNING: the callbacks must not update the redux state!
            action.payload.callback()
        },
        mergeSegment: (_, __: PayloadAction<{id: string}>) => {
            // TODO: implement
        }
    },
    extraReducers(builder) {
        builder.addCase(fetchTranscript.pending, (state, _) => {
            state.status = "loading"
        }).addCase(fetchTranscript.fulfilled, (state, action) => { // load segments from API response
            state.status = "success"
            state.id = action.payload.id,
            state.source = action.payload.source,
            state.created_at = action.payload.created_at
            state.speaker_tags = action.payload.speaker_tags
            state.text_tags = action.payload.text_tags
            state.segment_tags = action.payload.segment_tags
            action.payload.segments?.forEach(segment => {
                const id = uuid()
                state.segments.keys.push(id)
                state.segments.entities[id] = segment
            })
        }).addCase(fetchTranscript.rejected, (state, _) => {
            state.status = "error"
            // TODO: handle error message
        })
    }
})

export const { createSegment, updateSegment, deleteSegment, mergeSegment } = transcriptSlice.actions

export const selectTranscript = (state: RootState) => state.transcript
export const selectTranscriptStatus = (state: RootState) => state.transcript.status
export const selectSegments = (state: RootState) => state.transcript.segments
export const selectSegmentIDs = (state: RootState) => state.transcript.segments.keys
export const selectSegmentByID = (state: RootState, id: string) => state.transcript.segments.entities[id]

export default transcriptSlice.reducer
