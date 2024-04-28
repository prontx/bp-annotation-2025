import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"

// types
import type { RootState } from "../../../redux/store"
import type { GroupCreationPayload } from "../types/GroupActionPayload"
import { GroupingState } from "../types/GroupingState"
import { Lookup } from "../../../types/Lookup"
import { Group } from "../types/Group"

// utils
import { v4 as uuid } from 'uuid'


const initialState: GroupingState = {
    isEditing: false,
    selecting: null,
    selectedSegmentIDs: {
        start: "",
        end: "",
    },
    parentSegmentIDs: {
        start: "",
        end: "",
    },
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
        loadGroups: (state, action: PayloadAction<Lookup<Group>>) => {
            state.groups = action.payload
        },
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
                state.selectedSegmentIDs.start = action.payload.id
            } else if (state.selecting === "end" || action.payload.type === "end"){
                state.selectedSegmentIDs.end = action.payload.id
            }

            if (state.selecting == "start" && !state.selectedSegmentIDs.end){
                state.selecting = "end"
            } else {
                state.selecting = null
            }
        },
        resetSelecting: (state) => {
            state.selectedSegmentIDs.start = ""
            state.selectedSegmentIDs.end = ""
            state.selecting = null
        },
        startEditing: (state, action: PayloadAction<string|undefined>) => {
            state.isEditing = true
            state.parentSegmentIDs.start = action.payload ? state.groups.entities[action.payload].startSegmentID : ""
            state.parentSegmentIDs.end = action.payload ? state.groups.entities[action.payload].endSegmentID : ""
        },
        endEditing: (state) => {
            state.isEditing = false
            state.parentSegmentIDs.start = ""
            state.parentSegmentIDs.end = ""
            state.selecting = null
            state.selectedSegmentIDs.start = ""
            state.selectedSegmentIDs.end = ""
        },
        setGroupingFromHistory: (state, action: PayloadAction<Pick<GroupingState, "groups"|"startSegment2Group"|"endSegment2Group">>) => {
            // set state from history
            state.groups = action.payload.groups
            state.startSegment2Group = action.payload.startSegment2Group
            state.endSegment2Group = action.payload.endSegment2Group

            // reset varibles
            state.isEditing = false
            state.selecting = null
            state.parentSegmentIDs.start = ""
            state.selectedSegmentIDs.end = ""
            state.parentSegmentIDs.start = ""
            state.parentSegmentIDs.end = ""
        },
    },
})

export const { loadGroups, createOrUpdateGroup, deleteGroup, beginSelecting, chooseSegment,
            resetSelecting, startEditing, endEditing, setGroupingFromHistory } = groupingSlice.actions

export const selectGroups = (state: RootState) => state.grouping.groups
export const selectGroupIDs = (state: RootState) => state.grouping.groups.keys
export const selectSelecting = (state: RootState) => state.grouping.selecting
export const selectParentStartEndSegmentIDs = (state: RootState) => state.grouping.parentSegmentIDs
export const selectIsEditing = (state: RootState) => state.grouping.isEditing
export const selectGroupsByStartSegment = createSelector(
    (state: RootState) => state.grouping.startSegment2Group,
    (mapping) => (segmentID: string) => mapping[segmentID]
)
export const selectStartEndSegment2Group = createSelector(
    [(state: RootState) => state.grouping.startSegment2Group, (state: RootState) => state.grouping.endSegment2Group],
    (startMapping, endMapping) => ({
        startSegment2Group: startMapping,
        endSegment2Group: endMapping,
    })
)
export const selectStartEndSegmentIDs = createSelector(
    [selectSelecting, (state: RootState) => state.grouping.selectedSegmentIDs],
    (selecting, selected) => {
        switch (selecting) {
            case "start":
                return {start: "", end: selected.end}
            case "end":
                return {start: selected.start, end: ""}
            default:
                return selected
        }
    }
)
export const selectGroupByID = createSelector(
    (state: RootState) => state.grouping.groups.entities,
    (entities) => (id?: string) => id ? entities[id] : undefined
)

export default groupingSlice.reducer
