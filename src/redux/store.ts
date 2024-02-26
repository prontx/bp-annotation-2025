import { configureStore } from '@reduxjs/toolkit'

// refucers
import playbackReducer from '../features/playback/redux/playbackSlice'
import jobReducer from "../features/job/redux/jobSlice"
import transcriptReducer from "../features/transcript/redux/transcriptSlice"

export const store = configureStore({
  reducer: {
    job: jobReducer,
    playback: playbackReducer,
    transcript: transcriptReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
