import { configureStore } from '@reduxjs/toolkit'

// refucers
import playbackReducer from './slices/playbackSlice'
import segmentReducer from './slices/segmentSlice'
import jobReducer from "../features/job/redux/jobSlice"
import transcriptReducer from "../features/transcript/redux/transcriptSlice"

export const store = configureStore({
  reducer: {
    job: jobReducer,
    playback: playbackReducer,
    segments: segmentReducer,
    transcript: transcriptReducer
  } // FIXME: remove segment slice
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
