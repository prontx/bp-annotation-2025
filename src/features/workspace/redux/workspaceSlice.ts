import { PayloadAction, createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// types
import { RootState } from "../../../redux/store"
import { Workspace } from "../types/Workspace"
import { Job } from "../types/Job"
import { Snapshot } from "../types/History"
import { APIErrorResponse } from "../../../types/APIErrorResponse"

// utils
import axios from "../../../utils/getAxios"

// testing // FIXME
import { JOB_ID } from '../../../testing/test.config'


const MAX_HISTORY_ITEMS = 20

export const fetchJob = createAsyncThunk("job", async (_, { rejectWithValue }) => {
    try {
        const { data } = await axios.get<Job>(JOB_ID)
        return data
    } catch (err) {
        if (!(err instanceof Error && "response" in err && err.response instanceof Object && "data" in err.response)){
            throw {code: 400, message: "Unknown error."}
        }
        throw rejectWithValue(err.response.data);
    }
})

const initialState: Workspace = {
    jobID: "",
    title: "",
    duration: 0,
    loadingStatus: "idle",
    errorMessage: "",
    groupTags: null,
    groupTagShortlist: null,
    url: {
        thumbnail: "",
        waveform: "",
        mp3: "",
        transcript: "",
        waveform_data: "",
    },
    history: {
        shouldTriggerUpdate: false,
        pointer: -1,
        snapshots: [],
    },
    saving: {
        timestamp: Date.now(),
        manualSave: false,
    }
}

export const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        save: (state) => {
            state.saving.manualSave = true
        },
        saved: (state) => {
            state.saving.manualSave = false
            state.saving.timestamp = Date.now()
        },
        historyPush: (state, action: PayloadAction<Snapshot>) => {
            state.history.shouldTriggerUpdate = false
            // remove future history
            if (state.history.pointer != state.history.snapshots.length -1){
                state.history.snapshots = state.history.snapshots.slice(0, state.history.pointer + 1)
            }
            // update pointer & ensure MAX_HISTORY_ITEMS
            if (state.history.snapshots.length < MAX_HISTORY_ITEMS){
                state.history.pointer = state.history.pointer + 1
            } else {
                state.history.snapshots.shift()
            }
            // push new
            state.history.snapshots.push(action.payload)
        },
        historyUndo: (state) => {
            if (state.history.pointer > 0){
                state.history.pointer = state.history.pointer - 1
                state.history.shouldTriggerUpdate = true
            }
        },
        historyRedo: (state) => {
            if (state.history.pointer < state.history.snapshots.length - 1){
                state.history.pointer = state.history.pointer + 1
                state.history.shouldTriggerUpdate = true
            }
        },
        resetShouldTriggerUpdate: (state) => {
            state.history.shouldTriggerUpdate = false
        },
    },
    extraReducers(builder) {
        builder.addCase(fetchJob.pending, (state, _) => {
            state.loadingStatus = "loading"
        }).addCase(fetchJob.fulfilled, (state, action) => {
            const {id, title, duration, user_interface, url} = action.payload
            state.jobID = id
            state.title = title
            state.duration = duration
            state.loadingStatus = "done"
            state.groupTags = user_interface?.group_tags || null
            state.groupTagShortlist = user_interface?.group_tag_shortlist || null
            state.url = url
        }).addCase(fetchJob.rejected, (state, action) => {
            state.loadingStatus = "error"
            state.errorMessage = (action.payload as APIErrorResponse).message
        })
    },
})

export const { save, saved, historyPush, historyUndo, historyRedo, resetShouldTriggerUpdate } = workspaceSlice.actions

export const selectSaving = (state: RootState) => state.workspace.saving
export const selectHistory = (state: RootState) => {
    const {pointer, snapshots} = state.workspace.history
    if (pointer < 0)
        return undefined
    return snapshots[pointer]
}
export const selectShouldTriggerUpdate = (state: RootState) => state.workspace.history.shouldTriggerUpdate
export const selectJobStatus = (state: RootState) => state.workspace.loadingStatus
export const selectDuration = (state: RootState) => state.workspace.duration
export const selectGroupTags = (state: RootState) => state.workspace.groupTags || undefined
export const selectTitle = (state: RootState) => state.workspace.title
export const selectAudioURL = (state: RootState) => state.workspace.url.mp3
export const selectWaveformURL = (state: RootState) => state.workspace.url.waveform_data

export default workspaceSlice.reducer
