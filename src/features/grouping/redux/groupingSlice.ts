import { createSlice } from "@reduxjs/toolkit"

// types
import type { Group } from "../types/Group"
import type { RootState } from "../../../redux/store"
import type { Lookup } from "../../../types/Lookup"


interface GroupingState {
    isCreating: boolean,
    isEditing: boolean,
    groups: Lookup<Group>,
    segment2Group: Record<string, string>
}

const initialState: GroupingState = {
    isCreating: false,
    isEditing: false,
    groups: {
        keys: [],
        entities: {}
    },
    segment2Group: {}
}

export const groupingSlice = createSlice({
    name: "groups",
    initialState,
    reducers: {}
})

export const {} = groupingSlice.actions

export const selectGroups = (state: RootState) => state.grouping.groups

export default groupingSlice.reducer
