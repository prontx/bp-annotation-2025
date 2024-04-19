import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// types
import { History, Snapshot } from "../types/History"
import { RootState } from "../../../redux/store"


const MAX_HISTORY_ITEMS = 20

const initialState: History = {
    shouldTriggerUpdate: false,
    pointer: -1,
    snapshots: [],
}

export const historySlice = createSlice({
    name: "history",
    initialState,
    reducers: {
        historyPush: (state, action: PayloadAction<Snapshot>) => {
            state.shouldTriggerUpdate = false
            // remove future history
            if (state.pointer != state.snapshots.length -1){
                state.snapshots = state.snapshots.slice(0, state.pointer + 1)
            }
            // update pointer & ensure MAX_HISTORY_ITEMS
            if (state.snapshots.length < MAX_HISTORY_ITEMS){
                state.pointer = state.pointer + 1
            } else {
                state.snapshots.shift()
            }
            // push new
            state.snapshots.push(action.payload)
        },
        historyUndo: (state) => {
            if (state.pointer > 0){
                state.pointer = state.pointer - 1
                state.shouldTriggerUpdate = true
            }
        },
        historyRedo: (state) => {
            if (state.pointer < state.snapshots.length - 1){
                state.pointer = state.pointer + 1
                state.shouldTriggerUpdate = true
            }
        },
        resetShouldTriggerUpdate: (state) => {
            state.shouldTriggerUpdate = false
        },
    },
})

export const { historyPush, historyUndo, historyRedo, resetShouldTriggerUpdate } = historySlice.actions

export const selectHistory2 = (state: RootState) => state.history
export const selectHistory = (state: RootState) => {
    const {pointer, snapshots} = state.history
    if (pointer < 0)
        return undefined
    return snapshots[pointer]
}
export const selectShouldTriggerUpdate = (state: RootState) => state.history.shouldTriggerUpdate

export default historySlice.reducer
