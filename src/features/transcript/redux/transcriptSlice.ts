// style
import { speakerColors } from '../../../style/tagColors'

// redux
import { createSelector } from '@reduxjs/toolkit'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { selectParentStartEndSegmentIDs } from '../../grouping/redux/groupingSlice'

// types
import type { Transcript, TranscriptLoadingParams } from "../types/Transcript"
import type { RootState } from '../../../redux/store'
import type { SegmentUpdatePayload, SegmentCreationPayload } from '../types/SegmentActionPayload'
import { Segment } from '../types/Segment'
import { SpeakerTag, SegmentTag } from '../types/Tag'
import { Lookup } from '../../../types/Lookup'
import { APIErrorResponse } from '../../../types/APIErrorResponse'

// utils
import { v4 as uuid } from 'uuid'
import { segment2RegionID } from '../utils/segment2RegionID'
import { adaptSegments } from '../utils/adaptSegments'
import { adaptSpeakers } from '../utils/adaptSpeakers'
import { createFetchAsyncThunk } from '../../../utils/createFetchAsyncThunk'


export const fetchTranscript = createFetchAsyncThunk<TranscriptLoadingParams>("transcript", "transcript")

const initialState: Transcript = {
    id: "",
    status: "idle",
    error: undefined,
    source: "",
    created_at: "",
    specialChar: "",
    lastFocusedSegment: "",
    speakerTags: [],
    segment_tags: [],
    segments: {
        keys: [],
        entities: {},
    },
    groups: [],
    region2ID: {},
    mostRecentSpeaker: "",
    deletedRegions: [],
    lastCreatedSegmentID: "",
}

export const transcriptSlice = createSlice({
    name: 'transcript',
    initialState,
    reducers: {
        createSegment: (state, action: PayloadAction<SegmentCreationPayload>) => {
            const { regionID, start, end } = action.payload;
        
            // 1. Check for duplicate regionID
            if (state.region2ID[regionID]) {
                console.warn("Segment with regionID already exists:", regionID);
                return;
            }
        
            // 2. Check for overlapping segments (using BOTH start and end)
            const existingSegment = Object.values(state.segments.entities).find(
                (seg) => seg.start === start && seg.end === end
            );
            if (existingSegment) {
                console.warn("Segment already exists at this position:", start, end);
                return;
            }
        
            // 3. Find previous segment (using end time)
            const previousSegments = state.segments.keys
                .map(key => state.segments.entities[key])
                .filter(seg => seg.end <= start) // Only consider segments that END before this one starts
                .sort((a, b) => b.start - a.start); // Most recent first
        
            const previousSpeaker = previousSegments[0]?.speaker || state.mostRecentSpeaker;
        
            // 4. Insert new segment
            const idx = state.segments.keys.findIndex(
                key => state.segments.entities[key].start > start
            );
        
            const id = uuid();
            if (idx === -1) {
                state.segments.keys.push(id);
            } else {
                state.segments.keys.splice(idx, 0, id);
            }
        
            // 5. Create the segment with speaker
            state.segments.entities[id] = {
                ...action.payload,
                speaker: previousSpeaker, 
                language: null,
                segment_tags: [],
                words: "",
            };
        
            // Track the created segment for scrolling
            state.lastCreatedSegmentID = id; 

            // 6. Update mappings
            state.region2ID[regionID] = id;
            state.mostRecentSpeaker = previousSpeaker;


            // // 6. Update mappings
            // state.region2ID[regionID] = id;
            // state.mostRecentSpeaker = previousSpeaker; // Track globally
        },

         // Update the mostRecentSpeaker
        updateMostRecentSpeaker: (state, action: PayloadAction<string>) => {
            state.mostRecentSpeaker = action.payload;
        },

        updateSegment: (state, action: PayloadAction<SegmentUpdatePayload>) => {
            
            let {type, key, change} = action.payload
            
            let segment = null
            
            if (type && key) {
                const currentSegment = state.segments.entities[key];
                
                // Merge changes while preserving existing speaker
                state.segments.entities[key] = {
                    ...currentSegment,
                    ...change,
                    speaker: change.speaker !== undefined ? change.speaker : currentSegment.speaker
                };
        
                // Only update mostRecentSpeaker if speaker changed
                if (change.speaker) {
                    state.mostRecentSpeaker = change.speaker;
                }
            }

            console.log("updated segment: " + JSON.stringify(segment))
            console.log("entities: " + JSON.stringify(state.segments.entities[key]))

             // ensure keys stay ordered on start change
             if (change.start){
                state.segments.keys = state.segments.keys.sort((a, b) =>
                    state.segments.entities[a].start - state.segments.entities[b].start
                )
            }

            console.log("provedena zmena" + JSON.stringify(change))
        },
        // deleteSegment: (state, action: PayloadAction<string>) => {
        //     console.log("deletin)")
        //     const segmentID = action.payload 
        //     const idx = state.segments.keys.findIndex(key => key === segmentID)
        //     if (idx >= 0 && idx < state.segments.keys.length){
        //         state.segments.keys.splice(idx, 1)
        //     }

        //     let regionID = segment2RegionID(state.region2ID, segmentID)
        //     delete state.segments.entities[segmentID]
        //     if (regionID){                
        //         // delete regionID from id lookup
        //         delete state.region2ID[regionID]
        //     }
        // },

        deleteSegment: (state, action: PayloadAction<string>) => {
            const segmentID = action.payload;
            
            // 1. Remove from Redux state
            const idx = state.segments.keys.findIndex(key => key === segmentID);
            if (idx >= 0) {
                state.segments.keys.splice(idx, 1);
            }
            delete state.segments.entities[segmentID];
        
            // 2. Remove region mapping
            const regionID = Object.entries(state.region2ID)
                .find(([_, segID]) => segID === segmentID)?.[0];
            if (regionID) {
                delete state.region2ID[regionID];
            }
            
            if(!regionID) return;
            // 3. Add temporary field to trigger WaveSurfer cleanup
            state.deletedRegions.push(regionID); //
        },

        clearDeletedRegions: (state) => {
            state.deletedRegions = [];
        },

        mergeSegment: (state, action: PayloadAction<string>) => {
            const id = action.payload
            const keys = state.segments.keys
            const idx = keys.findIndex(key => key === id)

            if (idx < 0 || idx + 1 >= keys.length)
                return

            const current = state.segments.entities[id]
            const next = state.segments.entities[keys[idx+1]]
            next.start = current.start
            next.words = current.words + " " + next.words
            
            let regionID = segment2RegionID(state.region2ID, id)
            keys.splice(idx, 1)
            delete state.segments.entities[id]

            if (regionID){
                // delete regionID from id lookup
                delete state.region2ID[regionID]
            }
        },
        mapRegion2Segment: (state, action: PayloadAction<{segmentID: string, regionID: string}>) => {
            const { segmentID, regionID } = action.payload;
    
            
            state.region2ID[regionID] = segmentID;
            state.lastCreatedSegmentID = segmentID;
        },
        setSpecialChar: (state, action: PayloadAction<string>) => {
            state.specialChar = action.payload
        },
        setLastFocusedSegment: (state, action: PayloadAction<string>) => {
            state.lastFocusedSegment = action.payload
        },
        setSegmentsFromHistory: (state, action: PayloadAction<Lookup<Segment>>) => {
            // This doesnt get called!
            
            state.segments.entities = action.payload.entities
            state.segments.keys = action.payload.keys
            
            // reset variables
            state.specialChar = ""
            state.lastFocusedSegment = ""
        },
        setSpeakersFromHistory: (state, action: PayloadAction<SpeakerTag[]>) => {
            state.speakerTags = action.payload
        },
        setSegmentTagsFromHistory: (state, action: PayloadAction<SegmentTag[]>) => {
            state.segment_tags = action.payload
        },
        updateSpeaker: (state, action: PayloadAction<SpeakerTag>) => {
            if (!state.speakerTags)
                state.speakerTags = []

            const idx = state.speakerTags.findIndex(tag => tag.id === action.payload.id)
            if (idx < 0)
                return

            const shouldAddEmpty = state.speakerTags[idx].label === ""
            state.speakerTags[idx] = action.payload

            if (!shouldAddEmpty)
                return

            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            let key_arr = alphabet.split("")
            state.speakerTags.forEach(tag => key_arr = key_arr.filter(k => k !== tag.id))
            
            // if a key is available, add an empty speaker
            if (key_arr.length === 0)
                return

            const emptySpeaker = {
                id: key_arr[0],
                label: "",
                color: speakerColors[alphabet.indexOf(key_arr[0]) % speakerColors.length],
            }
            state.speakerTags.push(emptySpeaker)
        },
        deleteSpeaker: (state, action: PayloadAction<string>) => {
            if (!state.speakerTags)
                return

            const idx = state.speakerTags.findIndex(st => st.id === action.payload)
            state.speakerTags.splice(idx, 1)
        },
        setLastCreatedSegmentID: (state, action: PayloadAction<string>) => {
            state.lastCreatedSegmentID = action.payload
        },
        resetLastCreatedSegmentID: (state) => {
            state.lastCreatedSegmentID = null
        },
        toggleSegmentTag: (state, action: PayloadAction<{segmentID: string, tagID: string}>) => {
            const { segmentID, tagID } = action.payload;
            const segment = state.segments.entities[segmentID];
            
            if (segment) {
                const index = segment.segment_tags.indexOf(tagID);
                if (index === -1) {
                    // Add tag
                    segment.segment_tags.push(tagID);
                } else {
                    // Remove tag
                    segment.segment_tags.splice(index, 1);
                }
            }
        },   
        setActiveSegmentId: (state, action: PayloadAction<string>) => {
            state.activeSegmentId = action.payload;
        },
        resetActiveSegmentId: (state) => {
          state.activeSegmentId = null;
        },
        loadTranscriptData: (state, action: PayloadAction<TranscriptLoadingParams>) => {
            const {segments, speaker_tags, ...transcriptCommon} = action.payload
            const transformedSegments = adaptSegments(segments)
            const transformedTags = adaptSpeakers(speaker_tags)
            state.segments = transformedSegments
            state.speakerTags = transformedTags
            state.status = "success"
        },
        setLastClickedSegmentID: (state, action: PayloadAction<string>) => {
            state.lastCreatedSegmentID = action.payload; // Reuse existing field
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchTranscript.pending, (state, _) => {
            state.status = "loading"
        }).addCase(fetchTranscript.fulfilled, (state, action) => { // load segments from API response
            const {segments, speaker_tags, ...transcriptCommon} = action.payload
            const transformedSegments = adaptSegments(segments)
            const transformedTags = adaptSpeakers(speaker_tags)
            return {...state, status: "success", ...transcriptCommon, segments: transformedSegments, speakerTags: transformedTags}
        }).addCase(fetchTranscript.rejected, (state, action) => {
            state.status = "error"
            state.error = action.payload as APIErrorResponse
        })
    }
})

export const { loadTranscriptData, createSegment, updateSegment, updateMostRecentSpeaker, deleteSegment, clearDeletedRegions, mergeSegment, mapRegion2Segment, setSpecialChar,
            setLastFocusedSegment, setSegmentsFromHistory, setSpeakersFromHistory, setSegmentTagsFromHistory, updateSpeaker, deleteSpeaker, setLastCreatedSegmentID, resetLastCreatedSegmentID, toggleSegmentTag, setActiveSegmentId, resetActiveSegmentId } = transcriptSlice.actions

export const selectTranscript = (state: RootState) => state.transcript
export const selectTranscriptStatus = (state: RootState) => state.transcript.status
export const selectSegments = (state: RootState) => state.transcript.segments
export const selectSpecialChar = (state: RootState) => state.transcript.specialChar
export const selectLastFocusedSegment = (state: RootState) => state.transcript.lastFocusedSegment
export const selectSpeakers = (state: RootState) => state.transcript.speakerTags
export const selectGroupsRaw = (state: RootState) => state.transcript.groups
export const selectTranscriptError = (state: RootState) => state.transcript.error
const selectSegmentKeys = (state: RootState) => state.transcript.segments.keys
const selectSegmentEntities = (state: RootState) => state.transcript.segments.entities
export const selectSegmentIDs = createSelector(
    [selectParentStartEndSegmentIDs, selectSegmentKeys],
    (parentIDs, keys) => {
        let startIdx = 0
        let endIdx = keys.length
        if (parentIDs.start){
            const idx = keys.findIndex(key => key === parentIDs.start)
            if (idx >= 0)
                startIdx = idx
        }
        if (parentIDs.end){
            const idx = keys.findIndex(key => key === parentIDs.end)
            if (idx >= 0)
                endIdx = idx + 1
        }
        return keys.slice(startIdx, endIdx)
    }
)
export const selectGroupLen = createSelector(
    selectSegmentKeys,
    (keys) => (startSegmentID?: string, endSegmentID?: string) => {
        if (!startSegmentID || !endSegmentID)
            return 0

        let i = keys.findIndex(key => key === startSegmentID)
        if (i < 0)
            return 0

        for (let j = 0; i+j < keys.length; j++){
            if (keys[i+j] === endSegmentID){
                return j + 1
            }
        }
        return 0
    }
)
export const selectSegmentByID = createSelector(
    [selectSegmentEntities],
    (entities) => (id: string) => entities[id]
)
export const selectStartEndTimeBySegmentIDs = createSelector(
    selectSegmentEntities,
    (entities) => (startID: string, endID: string) => ({
        startTime: entities[startID]?.start,
        endTime: entities[endID]?.end
    })
)
export const selectGroupStartEndByIDs = createSelector(
    selectSegmentEntities,
    (entities) => (startID: string|undefined, endID: string|undefined) => {
        if (!startID || !endID)
            return [-1, -1]
        return [entities[startID]?.start || -1, entities[endID]?.end || -1]
    }
)
export const selectSpeakerByID = createSelector(
    selectSpeakers,
    (speakers) => (id: string|undefined) => speakers.find(speaker => speaker.id === id)
)
export const selectSpeaker2Color = createSelector(
    selectSpeakers,
    (speakers) => {
        if (!speakers)
            return {}

        let mapping: Record<string, string> = {}
        speakers.forEach(speaker => {
            if (speaker.color){
                mapping[speaker.id] = speaker.color
            }
        })
        return mapping
    }
)
export const selectSegmentWords = createSelector(
    selectSegmentEntities,
    (entities) => (id: string) => entities[id]?.words || ""
)
export const selectSpeakerIDBySegment = createSelector(
    [selectSegmentByID],
    (segmentByID) => (id: string) => segmentByID(id).speaker
)
export const selectSegmentTags = (state: RootState) => 
    state.transcript.segment_tags || [];

export const selectLastCreatedSegmentID = (state: RootState) => state.transcript.lastCreatedSegmentID

export const selectActiveSegmentId = (state: RootState) => state.transcript.activeSegmentId;

export default transcriptSlice.reducer
