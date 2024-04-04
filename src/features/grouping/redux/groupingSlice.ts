import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// types
import type { Group } from "../types/Group"
import type { RootState } from "../../../redux/store"
import type { Lookup } from "../../../types/Lookup"
import type { GroupCreationPayload } from "../types/GroupActionPayload"

// utils
import { v4 as uuid } from 'uuid';


interface GroupingState {
    isSelecting: boolean,
    selectedSegmentID: string,
    groups: Lookup<Group>,
    segment2Group: Record<string, string>
}

const initialState: GroupingState = {
    isSelecting: false,
    selectedSegmentID: "",
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
        beginSelecting: (state) => {
            state.isSelecting = true
        },
        selectSegment: (state, action: PayloadAction<string>) => {
            state.selectedSegmentID = action.payload
        },
        resetSelecting: (state) => {
            state.selectedSegmentID = ""
            state.isSelecting = false
        },
    },
})

export const { createOrUpdateGroup, deleteGroup, beginSelecting, selectSegment, resetSelecting } = groupingSlice.actions

export const selectGroups = (state: RootState) => state.grouping.groups
export const selectGroupIDs = (state: RootState) => state.grouping.groups.keys
export const selectGroupByID = (state: RootState, id?: string) => {
    if (!id)
        return undefined
    return state.grouping.groups.entities[id]}
export const selectIsSelecting = (state: RootState) => state.grouping.isSelecting
export const selectSelectedSegmentID = (state: RootState) => state.grouping.selectedSegmentID

export default groupingSlice.reducer
