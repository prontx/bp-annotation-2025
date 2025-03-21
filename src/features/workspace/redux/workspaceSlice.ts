import { PayloadAction, createSlice, createSelector } from "@reduxjs/toolkit"

// types
import { RootState } from "../../../redux/store"
import { Workspace } from "../types/Workspace"
import { Job } from "../types/Job"
import { Snapshot } from "../types/History"
import { APIErrorResponse } from "../../../types/APIErrorResponse"

// utils
import { createFetchAsyncThunk } from "../../../utils/createFetchAsyncThunk"

//notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MAX_HISTORY_ITEMS = 20

export const fetchJob = createFetchAsyncThunk<Job>("job")

const initialState: Workspace = {
    jobID: "",
    title: "",
    duration: 0,
    loadingStatus: "idle",
    error: null,
    groupTags: [],
    groupTagShortlist: [],
    url: {
        thumbnail: "",
        waveform: "",
        mp3: "",
        transcript: "",
        waveform_data: "",
    },
    history: {
        enable: false,
        shouldTriggerUpdate: false,
        pointer: -1,
        snapshots: [],
    },
    manualSave: false,
    autosaveEnabled: true, 
}

export const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        save: (state) => {
            state.manualSave = true
            // toast("Uloženo !");
            toast.update("save-toast", {
                render: "✅ Uloženo!",
                type: "success",
                autoClose: 2000,
            });
        },
        saved: (state) => {
            state.manualSave = false
        },
        enableHistory: (state) => {
            state.history.enable = true
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
        setError: (state, action: PayloadAction<APIErrorResponse>) => {
            state.error = action.payload
        },
        setAutosaveEnabled: (state, action: PayloadAction<boolean>) => {
            console.log("autosave enabled.")
            state.autosaveEnabled = action.payload
        },
        loadJobData: (state, action: PayloadAction<Job>) => {
            const {id, title, duration, user_interface, url} = action.payload
            state.jobID = id
            state.title = title
            state.duration = duration
            state.loadingStatus = "done"
            state.groupTags = user_interface?.group_tags || []
            state.groupTagShortlist = user_interface?.group_tag_shortlist || []
            if (url){
                state.url = url
                console.log("url: " + JSON.stringify(url))
            }
        }
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
            state.groupTags = user_interface?.group_tags || []
            state.groupTagShortlist = user_interface?.group_tag_shortlist || []
            if (url){
                state.url = url
                console.log("url: " + JSON.stringify(url))
            }
        }).addCase(fetchJob.rejected, (state, action) => {
            state.loadingStatus = "error"
            state.error = action.payload as APIErrorResponse
        })
    },
})

// Thunk: Delays save by X seconds before dispatching the reducer
export const delayedSave = (delay = 5) => (dispatch: any) => {
    let countdown = delay;
    
    // Create a single toast notification
    const toastId = toast(`💾 Ukládám za ${countdown} s...`, {
        toastId: "save-toast", // Ensures only one toast instance updates
        autoClose: false,
        closeOnClick: false,
    });

    const intervalID = setInterval(() => {
        countdown--;

        // Update the same toast message
        toast.update(toastId, {
            render: `💾 Ukládám za ${countdown} s...`,
        });

        if (countdown <= 0) {
            clearInterval(intervalID);
            dispatch(workspaceSlice.actions.save());
        }
    }, 1000);
};



export const { loadJobData, save, saved, enableHistory, historyPush, historyUndo, historyRedo, resetShouldTriggerUpdate, setError, setAutosaveEnabled } = workspaceSlice.actions

export const selectJobID = (state: RootState) => state.workspace.jobID
export const selectManualSave = (state: RootState) => state.workspace.manualSave
export const selectHistoryEnable = (state: RootState) => state.workspace.history.enable
export const selectShouldTriggerUpdate = (state: RootState) => state.workspace.history.shouldTriggerUpdate
export const selectJobStatus = (state: RootState) => state.workspace.loadingStatus
export const selectDuration = (state: RootState) => state.workspace.duration
export const selectGroupTags = (state: RootState) => state.workspace.groupTags
export const selectTitle = (state: RootState) => state.workspace.title
export const selectAudioURL = (state: RootState) => state.workspace.url.mp3
export const selectWaveformURL = (state: RootState) => state.workspace.url.waveform_data
export const selectJobError = (state: RootState) => state.workspace.error
export const selectAutosaveEnabled = (state: RootState) => state.workspace.autosaveEnabled
export const selectHistory = createSelector(
    [(state: RootState) => state.workspace.history],
    (history) => history.snapshots[history.pointer]
)

export default workspaceSlice.reducer
