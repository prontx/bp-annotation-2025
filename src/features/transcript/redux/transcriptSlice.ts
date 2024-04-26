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
import { segment2RegionID } from '../utils/segment2RegionID'

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

             // ensure keys stay ordered on start change
             if (change.start){
                state.segments.keys = state.segments.keys.sort((a, b) =>
                    state.segments.entities[a].start - state.segments.entities[b].start
                )
            }
        },
        deleteSegment: (state, action: PayloadAction<{id: string, callback: () => void}>) => {
            const idx = state.segments.keys.findIndex(key => key === action.payload.id)
            if (idx >= 0 && idx < state.segments.keys.length){
                state.segments.keys.splice(idx, 1)
            }

            let regionID = segment2RegionID(state.region2ID, action.payload.id)
            delete state.segments.entities[action.payload.id]
            if (regionID){                
                // delete regionID from id lookup
                delete state.region2ID[regionID]
            }

            // reload waveform regions
            // WARNING: the callbacks must not update the redux state!
            action.payload.callback()
        },
        mergeSegment: (state, action: PayloadAction<{id: string, callback: () => void}>) => {
            const {id, callback} = action.payload
            const keys = state.segments.keys
            const idx = keys.findIndex(key => key === id)

            if (idx < 0 || idx + 1 >= keys.length)
                return

            const current = state.segments.entities[id]
            const next = state.segments.entities[keys[idx+1]]
            next.start = current.start
            next.words = current.words + " " + next.words
            
            let regionID = segment2RegionID(state.region2ID, action.payload.id)
            keys.splice(idx, 1)
            delete state.segments.entities[id]

            if (regionID){
                // delete regionID from id lookup
                delete state.region2ID[regionID]
            }

            // reload waveform regions
            // WARNING: the callbacks must not update the redux state!
            callback()
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
        },
        setSpeakersFromHistory: (state, action: PayloadAction<SpeakerTag[]>) => {
            state.speaker_tags = action.payload
        },
        updateSpeaker: (state, action: PayloadAction<SpeakerTag>) => {
            if (!state.speaker_tags)
                state.speaker_tags = []

            const idx = state.speaker_tags.findIndex(tag => tag.id === action.payload.id)
            if (idx < 0)
                return

            const shouldAddEmpty = state.speaker_tags[idx].label === ""
            state.speaker_tags[idx] = action.payload

            if (!shouldAddEmpty)
                return

            let key_arr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
            state.speaker_tags.forEach(tag => key_arr = key_arr.filter(k => k !== tag.id))
            
            // if a key is available, add an empty speaker
            if (key_arr.length === 0)
                return

            const emptySpeaker = {
                id: key_arr[0],
                label: "",
                color: speakerColors[state.speaker_tags.length % speakerColors.length],
            }
            state.speaker_tags.push(emptySpeaker)
        },
        deleteSpeaker: (state, action: PayloadAction<string>) => {
            if (!state.speaker_tags)
                return

            const idx = state.speaker_tags.findIndex(st => st.id === action.payload)
            state.speaker_tags.splice(idx, 1)
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
            let possible_keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
            for (const [index, tag] of action.payload.speaker_tags?.entries() || []){
                if (!tag.label)
                    continue

                possible_keys = possible_keys.filter(k => k !== tag.id)
                
                if (!tag.color){
                    tag.color = speakerColors[index % speakerColors.length]
                }
                transformedTags.push(tag)
            }
            transformedTags.push({
                id: possible_keys[0],
                label: "",
                color: speakerColors[transformedTags.length % speakerColors.length],
            })
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

export const { createSegment, updateSegment, deleteSegment, mergeSegment, mapRegion2Segment, setSpecialChar,
            setLastFocusedSegment, setSegmentsFromHistory, setSpeakersFromHistory, updateSpeaker, deleteSpeaker } = transcriptSlice.actions

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
    return [state.transcript.segments.entities[startID]?.start || -1, state.transcript.segments.entities[endID]?.end || -1]
}
export const selectSpecialChar = (state: RootState) => state.transcript.specialChar
export const selectLastFocusedSegment = (state: RootState) => state.transcript.lastFocusedSegment
export const selectSpeakers = (state: RootState) => state.transcript.speaker_tags || []
export const selectSpeakerByID = (state: RootState, id: string|undefined) => state.transcript.speaker_tags?.find(st => st.id === id)

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
export const selectSegmentWords = (state: RootState, id: string) => state.transcript.segments.entities[id]?.words || ""

export default transcriptSlice.reducer
