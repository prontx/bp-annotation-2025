import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// types
import type { RootState } from "../../../redux/store"
import type { GroupCreationPayload } from "../types/GroupActionPayload"
import { GroupingState } from "../types/GroupingState"

// utils
import { v4 as uuid } from 'uuid'


const initialState: GroupingState = {
    isEditing: false,
    selecting: null,
    selected: {
        startSegmentID: "",
        endSegmentID: "",
    },
    parentStartSegmentID: "",
    parentEndSegmentID: "",
    groups: {
        keys: [],
        entities: {}
    },
    startSegment2Group: {},
    endSegment2Group: {},
}

export const groupingSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        createOrUpdateGroup: (state, action: PayloadAction<GroupCreationPayload>) => {
            // remove old records from {start|end}Segment2Group if {start|end}SegmentID changed
            if (action.payload.id){
                const old = state.groups.entities[action.payload.id]
                if (old.startSegmentID !== action.payload.startSegmentID)
                    state.startSegment2Group[old.startSegmentID] = state.startSegment2Group[old.startSegmentID].filter(groupID => groupID !== action.payload.id)
                if (old.endSegmentID !== action.payload.endSegmentID)
                    state.endSegment2Group[old.endSegmentID] = state.endSegment2Group[old.endSegmentID].filter(groupID => groupID !== action.payload.id)
            }

            // create or update a group entity
            const id = action.payload.id || uuid()
            state.groups.entities[id] = {
                id: id,
                ...action.payload,
                childrenIDs: action.payload.id ? state.groups.entities[id].childrenIDs : [],
            }
            
            // insert key
            if (!action.payload.id){
                if (!action.payload.parentID){
                    state.groups.keys.push(id)
                } else {
                    state.groups.entities[action.payload.parentID].childrenIDs.push(id)
                }
            }

            // add new records to {start|end}Segment2Group
            const {startSegmentID, endSegmentID} = action.payload
            if (!state.startSegment2Group[startSegmentID]){
                state.startSegment2Group[startSegmentID] = [id]
            }
            if (!state.startSegment2Group[startSegmentID].includes(id)){
                state.startSegment2Group[startSegmentID].push(id)
            }
            if (!state.endSegment2Group[endSegmentID]){
                state.endSegment2Group[endSegmentID] = [id]
            }
            if (!state.endSegment2Group[endSegmentID].includes(id)){
                state.endSegment2Group[endSegmentID].push(id)
            }
        },
        deleteGroup: (state, action: PayloadAction<{id: string, parentID?: string}>) => {
            const {id, parentID} = action.payload

            // remove reference from parent or top level groupID list
            if (parentID){
                const parent = state.groups.entities[parentID]
                const idx = parent.childrenIDs.findIndex(childID => childID === id)
                parent.childrenIDs.splice(idx, 1)
            } else {
                const idx = state.groups.keys.findIndex(groupID => groupID === id)
                state.groups.keys.splice(idx, 1)
            }
            
            // cascade delete
            const toDelete: string[] = [id]
            for (let i = 0; i < toDelete.length; i++){
                const group = state.groups.entities[toDelete[i]]
                toDelete.concat(group.childrenIDs)
            }
            toDelete.forEach(deleteID => delete state.groups.entities[deleteID])
        },
        beginSelecting: (state, action: PayloadAction<"start"|"end"|null>) => {
            state.selecting = action.payload
        },
        chooseSegment: (state, action: PayloadAction<{id: string, type?: "start"|"end"}>) => {
            if (state.selecting === "start" || action.payload.type === "start"){
                state.selected.startSegmentID = action.payload.id
            } else if (state.selecting === "end" || action.payload.type === "end"){
                state.selected.endSegmentID = action.payload.id
            }

            if (state.selecting == "start" && !state.selected.endSegmentID){
                state.selecting = "end"
            } else {
                state.selecting = null
            }
        },
        resetSelecting: (state) => {
            state.selected.startSegmentID = ""
            state.selected.endSegmentID = ""
            state.selecting = null
        },
        startEditing: (state, action: PayloadAction<string|undefined>) => {
            state.isEditing = true
            state.parentStartSegmentID = action.payload ? state.groups.entities[action.payload].startSegmentID : ""
            state.parentEndSegmentID = action.payload ? state.groups.entities[action.payload].endSegmentID : ""
        },
        endEditing: (state) => {
            state.isEditing = false
            state.parentStartSegmentID = ""
            state.parentEndSegmentID = ""
            state.selecting = null
            state.selected.startSegmentID = ""
            state.selected.endSegmentID = ""
        },
        setGroupingFromHistory: (state, action: PayloadAction<Pick<GroupingState, "groups"|"startSegment2Group"|"endSegment2Group">>) => {
            // set state from history
            state.groups = action.payload.groups
            state.startSegment2Group = action.payload.startSegment2Group
            state.endSegment2Group = action.payload.endSegment2Group

            // reset varibles
            state.isEditing = false
            state.selecting = null
            state.parentStartSegmentID = ""
            state.selected.endSegmentID = ""
            state.parentStartSegmentID = ""
            state.parentEndSegmentID = ""
        },
    },
})

export const { createOrUpdateGroup, deleteGroup, beginSelecting, chooseSegment, resetSelecting, startEditing, endEditing, setGroupingFromHistory } = groupingSlice.actions

export const selectGroups = (state: RootState) => state.grouping.groups
export const selectGroupIDs = (state: RootState) => state.grouping.groups.keys
export const selectGroupByID = (state: RootState, id?: string) => {
    if (!id)
        return undefined
    return state.grouping.groups.entities[id]}
export const selectSelecting = (state: RootState) => state.grouping.selecting
export const selectStartEndSegmentIDs = (state: RootState) => {
    if (state.grouping.selecting === "start"){
        return {startSegmentID: "", endSegmentID: state.grouping.selected.endSegmentID}
    } else if (state.grouping.selecting === "end"){
        return {startSegmentID: state.grouping.selected.startSegmentID, endSegmentID: ""}
    }
    return state.grouping.selected
}
export const selectStartEndParentSegmentID = (state: RootState) => [state.grouping.parentStartSegmentID, state.grouping.parentEndSegmentID]
export const selectIsEditing = (state: RootState) => state.grouping.isEditing
export const selectGroupsByStartSegment = (state: RootState, segmentID: string) => state.grouping.startSegment2Group[segmentID] || []
export const selectGroupLen = (state: RootState, startSegmentID?: string, endSegmentID?: string) => {
    if (!startSegmentID || ! endSegmentID)
        return 0
    const keys = state.transcript.segments.keys
    let j = 0
    for (let i = keys.findIndex(k => k === startSegmentID); i+j < keys.length; j++){
        if (keys[i+j] === endSegmentID)
            break
    }
    return j + 1
}
export const selectStartEndSegment2Group = (state: RootState) => {
    return {
        startSegment2Group: state.grouping.startSegment2Group,
        endSegment2Group: state.grouping.endSegment2Group,
    }
}

export default groupingSlice.reducer
