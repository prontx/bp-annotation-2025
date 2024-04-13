import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// types
import type { Group } from "../types/Group"
import type { RootState } from "../../../redux/store"
import type { Lookup } from "../../../types/Lookup"
import type { GroupCreationPayload } from "../types/GroupActionPayload"

// utils
import { v4 as uuid } from 'uuid';


interface GroupingState {
    isEditing: boolean,
    selecting: "start"|"end"|null,
    selected: {
        startSegmentID: string,
        endSegmentID: string,
    },
    parentStartSegmentID: string,
    parentEndSegmentID: string,
    groups: Lookup<Group>,
    segment2Group: Record<string, string>
}

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
    segment2Group: {}
}

export const groupingSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {
        createOrUpdateGroup: (state, action: PayloadAction<GroupCreationPayload>) => {
            // create or update a group entity
            const id = action.payload.id || uuid()
            state.groups.entities[id] = {
                id: id,
                ...action.payload,
                childrenIDs: action.payload.id ? state.groups.entities[id].childrenIDs : [],
            }
            
            if (!action.payload.id){ // insert key
                if (!action.payload.parentID){
                    state.groups.keys.push(id)
                } else {
                    state.groups.entities[action.payload.parentID].childrenIDs.push(id)
                }
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

        }
    },
})

export const { createOrUpdateGroup, deleteGroup, beginSelecting, chooseSegment, resetSelecting, startEditing, endEditing } = groupingSlice.actions

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

export default groupingSlice.reducer
