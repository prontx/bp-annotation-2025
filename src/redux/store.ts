import { configureStore } from '@reduxjs/toolkit'

// reducers
import playbackReducer from '../features/playback/redux/playbackSlice'
import jobReducer from "../features/job/redux/jobSlice"
import transcriptReducer from "../features/transcript/redux/transcriptSlice"
import groupingReducer from "../features/grouping/redux/groupingSlice"
import historyReducer from "../features/history/redux/historySlice"

export const store = configureStore({
  reducer: {
    job: jobReducer,
    playback: playbackReducer,
    transcript: transcriptReducer,
    grouping: groupingReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Callbacks are passed into these reducers in order to manipulate waveform regions.
        // There is no way around it. WARNING: the callbacks must not update the redux state!
        ignoredActions: ['transcript/updateSegment', 'transcript/deleteSegment'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
