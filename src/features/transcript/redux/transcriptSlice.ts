// style
import { speakerColors } from '../../../style/tagColors'

// redux
import { createAsyncThunk } from '@reduxjs/toolkit'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

// types
import type { Transcript, TranscriptLoadingParams } from "../types/Transcript"
import type { RootState } from '../../../redux/store'
import type { SegmentUpdatePayload, SegmentCreationPayload } from '../types/SegmentActionPayload'
import { Segment } from '../types/Segment'
import { SpeakerTag } from '../types/Tag'

// utils
import { v4 as uuid } from 'uuid'
import axios from "../../../utils/getAxios"
import { segmentWords2String } from '../../../utils/segmentWords2String'

// testing
import { JOB_ID } from '../../../testing/test.config'
import { Lookup } from '../../../types/Lookup'


export const fetchTranscript = createAsyncThunk("transcript", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get<TranscriptLoadingParams>(`${JOB_ID}/transcript`)
        return data
    } catch (err) {
        if (!(err instanceof Error && "response" in err && err.response instanceof Object && "data" in err.response)){
            throw {code: 400, message: "Unknown error."}
        }
        throw rejectWithValue(err.response.data);
    }
})

const initialState: Transcript = {
    id: "",
    status: "idle",
    source: "",
    created_at: "",
    specialChar: "",
    lastFocusedSegment: "",
    speaker_tags: null,
    segments: {
        keys: [],
        entities: {},
    },
    region2ID: {},
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
                words: "",
            }
            state.region2ID[action.payload.regionID] = id
        },
        updateSegment: (state, action: PayloadAction<SegmentUpdatePayload>) => {
            let {type, key, change} = action.payload
            let segment = null

            // update entity
            if (type === "region"){
                key = state.region2ID[key]
            }
            if (key){
                segment = state.segments.entities[key]
                state.segments.entities[key] = {...segment, ...change}
            }

            // FIXME: update state.segments.keys order by state.segments.entities[key].start (possibly changed)
        },
        deleteSegment: (state, action: PayloadAction<{id: string, callback: () => void}>) => {
            const idx = state.segments.keys.findIndex(key => key === action.payload.id)
            if (idx >= 0 && idx < state.segments.keys.length){
                state.segments.keys.splice(idx, 1)
            }

            let regionID = ""
            for (const key in state.region2ID) {
                const segmentID = state.region2ID[key];
                if (segmentID === action.payload.id){
                    regionID = key
                    break
                }
            }
              
            delete state.segments.entities[action.payload.id]
            
            if (regionID){                
                // delete regionID from id lookup
                delete state.region2ID[regionID]
            }

            // reload waveform regions
            // WARNING: the callbacks must not update the redux state!
            action.payload.callback()
        },
        mergeSegment: (_, __: PayloadAction<{id: string}>) => {
            // TODO: implement
        },
        mapRegion2Segment: (state, action: PayloadAction<{segmentID: string, regionID: string}>) => {
            state.region2ID[action.payload.regionID] = action.payload.segmentID
        },
        setSpecialChar: (state, action: PayloadAction<string>) => {
            state.specialChar = action.payload
        },
        setLastFocusedSegment: (state, action: PayloadAction<string>) => {
            state.lastFocusedSegment = action.payload
        },
        setSegmentsFromHistory: (state, action: PayloadAction<Lookup<Segment>>) => {
            // load data from history
            state.segments.entities = action.payload.entities
            state.segments.keys = action.payload.keys
            
            // reset variables
            state.specialChar = ""
            state.lastFocusedSegment = ""

            // FIXME: rerender regions
        },
        setSpeakersFromHistory: (state, action: PayloadAction<SpeakerTag[]>) => {
            state.speaker_tags = action.payload
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchTranscript.pending, (state, _) => {
            state.status = "loading"
        }).addCase(fetchTranscript.fulfilled, (state, action) => { // load segments from API response
            const transformedSegments: Lookup<Segment> = {
                keys: [],
                entities: {},
            }
            action.payload.segments?.forEach(segmentRaw => {
                const segment: Segment = {
                    ...segmentRaw,
                    start: Number(segmentRaw.start.toFixed(1)),
                    end: Number(segmentRaw.end.toFixed(1)),
                    words: segmentWords2String(segmentRaw.words),
                }
                const id = uuid()
                transformedSegments.keys.push(id)
                transformedSegments.entities[id] = segment
            })
            const transformedTags: SpeakerTag[] = []
            for (const [index, tag] of action.payload.speaker_tags?.entries() || []){
                if (!tag.label)
                    continue
                
                if (!tag.color){
                    tag.color = speakerColors[index % speakerColors.length]
                }
                transformedTags.push(tag)
            }
            if (action.payload.speaker_tags){
                action.payload.speaker_tags = transformedTags
            }
            return {...state, status: "success", ...action.payload, segments: transformedSegments}
        }).addCase(fetchTranscript.rejected, (state, _) => {
            state.status = "error"
            // TODO: handle error message
        })
    }
})

export const { createSegment, updateSegment, deleteSegment, mergeSegment, mapRegion2Segment, setSpecialChar, setLastFocusedSegment, setSegmentsFromHistory, setSpeakersFromHistory } = transcriptSlice.actions

export const selectTranscript = (state: RootState) => state.transcript
export const selectTranscriptStatus = (state: RootState) => state.transcript.status
export const selectSegments = (state: RootState) => state.transcript.segments
export const selectSegmentIDs = (state: RootState) => {
    let startIdx = 0
    let endIdx = state.transcript.segments.keys.length
    if (state.grouping.parentStartSegmentID)
        startIdx = state.transcript.segments.keys.findIndex(id => id === state.grouping.parentStartSegmentID)
    if (state.grouping.parentEndSegmentID)
        endIdx = state.transcript.segments.keys.findIndex(id => id === state.grouping.parentEndSegmentID) + 1
    if (startIdx < 0)
        startIdx = 0
    if (endIdx < 0)
        endIdx = state.transcript.segments.keys.length
    return state.transcript.segments.keys.slice(startIdx, endIdx)
}
export const selectSegmentByID = (state: RootState, id: string) => state.transcript.segments.entities[id]
export const selectSegmentStartByID = (state: RootState, id: string) => {
    if (!id)
        return undefined
    return state.transcript.segments.entities[id].start
}
export const selectSegmentEndByID = (state: RootState, id: string) => {
    if (!id)
        return undefined
    return state.transcript.segments.entities[id].end
}
export const selectGroupStartEndByIDs = (state: RootState, startID: string|undefined, endID: string|undefined) => {
    if (!startID || !endID)
        return [-1, -1]
    return [state.transcript.segments.entities[startID].start, state.transcript.segments.entities[endID].end]
    // FIXME: can entities[ID] called from groups return undefined anyhow?
}
export const selectSpecialChar = (state: RootState) => state.transcript.specialChar
export const selectLastFocusedSegment = (state: RootState) => state.transcript.lastFocusedSegment
export const selectSpeakers = (state: RootState) => state.transcript.speaker_tags || []
export const selectSpeaker2Color = (state: RootState) => {
    let mapping: Record<string, string> = {}
    if (!state.transcript || !state.transcript.speaker_tags)
        return mapping
    state.transcript.speaker_tags.forEach(tag => {
        if (tag.color){
            mapping[tag.id] = tag.color
        }
    })
    return mapping
}

export default transcriptSlice.reducer
