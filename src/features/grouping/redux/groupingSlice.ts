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
        createGroup: (state, action: PayloadAction<GroupCreationPayload>) => {
            // create new group entity
            const id = uuid()
            state.groups.entities[id] = {
                id: id,
                ...action.payload,
                childrenIDs: [],
            }
            
            // insert key
            // TODO: add nesting -- top-level keys are in state.groups.keys, rest in entity.childrenIDs
            state.groups.keys.push(id)
            
            // FIXME: set `parentID`
            // FIXME: what if parent is created after its child?
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

export const { createGroup, beginSelecting, selectSegment, resetSelecting } = groupingSlice.actions

export const selectGroups = (state: RootState) => state.grouping.groups
export const selectGroupIDs = (state: RootState) => state.grouping.groups.keys
export const selectGroupByID = (state: RootState, id: string) => state.grouping.groups.entities[id]
export const selectIsSelecting = (state: RootState) => state.grouping.isSelecting
export const selectSelectedSegmentID = (state: RootState) => state.grouping.selectedSegmentID

export default groupingSlice.reducer
