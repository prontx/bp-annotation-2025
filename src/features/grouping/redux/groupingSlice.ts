import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit"

// types
import type { RootState } from "../../../redux/store"
import type { GroupCreationPayload } from "../types/GroupActionPayload"
import { GroupingState } from "../types/GroupingState"
import { Lookup } from "../../../types/Lookup"
import { Group } from "../types/Group"

// utils
import { v4 as uuid } from 'uuid'
import { removeGroupFromLookup } from "../utils/removeGroupFromMapping"
import { addGroupToSegmentMapping, removeGroupFromSegmentMapping } from "../utils/segment2GroupManipulations"


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
        loadGroups: (state, action: PayloadAction<{transformedGroups: Lookup<Group>, startSegment2Group: Record<string, string[]>, endSegment2Group: Record<string, string[]>}>) => {
            console.log("511 " + JSON.stringify(action))
            const { transformedGroups, startSegment2Group, endSegment2Group } = action.payload
            state.groups = transformedGroups || {}
            state.startSegment2Group = startSegment2Group
            state.endSegment2Group = endSegment2Group
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
            if (state.groups.entities) 
            {
                state.groups.entities[id] = {
                    id: id,
                    ...action.payload,
                    childrenIDs: action.payload.id ? state.groups.entities[id].childrenIDs : [],
                } || {}
            }
            
            // insert key
            if (!action.payload.id && state.groups.keys){
                if (!action.payload.parentID){
                    state.groups.keys.push(id)
                } else {
                    state.groups.entities[action.payload.parentID].childrenIDs.push(id)
                }
            }

            // add new records to {start|end}Segment2Group
            const {startSegmentID, endSegmentID} = action.payload
            addGroupToSegmentMapping(state.startSegment2Group, startSegmentID, id)
            addGroupToSegmentMapping(state.endSegment2Group, endSegmentID, id)
        },
        deleteGroup: (state, action: PayloadAction<{id: string, parentID?: string}>) => {
            const {id, parentID} = action.payload
            // Create a copy of the groups 
            const newGroups = {...state.groups}
            removeGroupFromLookup(newGroups, id, parentID)
            state.groups = newGroups
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
        updateGroupSegmentReferences: (
            state,
            action: PayloadAction<{ segmentID: string, segmentKeys: string[], isMerge?: boolean }>
          ) => {
            const { segmentID, segmentKeys } = action.payload;
            
            const affectedGroupIDs = new Set<string>([
              ...(state.startSegment2Group[segmentID] || []),
              ...(state.endSegment2Group[segmentID] || []),
            ]);
          
            const groupsToDelete = new Set<string>();
          
            affectedGroupIDs.forEach(groupID => {
              const group = state.groups.entities[groupID];
              if (!group) return;
          
              // Remove segmentID from the group's segment list
              const updatedSegments = [group.startSegmentID, ...group.childrenIDs, group.endSegmentID]
                .filter(id => id !== segmentID);
          
              if (updatedSegments.length === 0) {
                // If no segments remain, we mark them for deletion
                groupsToDelete.add(groupID);
                return;
              }
          
              // Finding the new start and end segment IDs based on segmentKeys order
              const newStartID = updatedSegments[0];
              const newEndID = updatedSegments[updatedSegments.length - 1];
          
              if (group.startSegmentID !== newStartID) {
                // Remove old mapping and update start segment
                removeGroupFromSegmentMapping(state.startSegment2Group, group.startSegmentID, groupID);
                group.startSegmentID = newStartID;
                addGroupToSegmentMapping(state.startSegment2Group, newStartID, groupID);
              }
          
              if (group.endSegmentID !== newEndID) {
                removeGroupFromSegmentMapping(state.endSegment2Group, group.endSegmentID, groupID);
                group.endSegmentID = newEndID;
                addGroupToSegmentMapping(state.endSegment2Group, newEndID, groupID);
              }
          
              // Ensure childrenIDs list is updated too
              group.childrenIDs = updatedSegments.slice(1, -1);
            });
          
            // Delete empty groups
            groupsToDelete.forEach(groupID => {
              removeGroupFromLookup(state.groups, groupID);
              Object.keys(state.startSegment2Group).forEach(key => {
                state.startSegment2Group[key] = state.startSegment2Group[key].filter(id => id !== groupID);
                if (state.startSegment2Group[key].length === 0) delete state.startSegment2Group[key];
              });
              Object.keys(state.endSegment2Group).forEach(key => {
                state.endSegment2Group[key] = state.endSegment2Group[key].filter(id => id !== groupID);
                if (state.endSegment2Group[key].length === 0) delete state.endSegment2Group[key];
              });
            });
          },
          
          
          
          
    },
})

export const { loadGroups, createOrUpdateGroup, deleteGroup, beginSelecting, chooseSegment,
            resetSelecting, startEditing, endEditing, setGroupingFromHistory, updateGroupSegmentReferences } = groupingSlice.actions

export const selectGroups = (state: RootState) => state.grouping.groups
// export const selectGroupIDs = (state: RootState) => state.grouping.groups.keys
export const selectGroupIDs = (state: RootState) =>
    state.grouping.groups?.keys ?? [];
export const selectSelecting = (state: RootState) => state.grouping.selecting
export const selectParentStartEndSegmentIDs = (state: RootState) => state.grouping.parentSegmentIDs
export const selectIsEditing = (state: RootState) => state.grouping.isEditing
export const selectGroupsByStartSegment = createSelector(
    (state: RootState) => state.grouping.startSegment2Group || {},
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
    (state: RootState) => state.grouping.groups?.entities,
    (entities) => (id?: string) => id ? entities[id] : undefined
)

export default groupingSlice.reducer
