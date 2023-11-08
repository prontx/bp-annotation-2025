import { configureStore } from '@reduxjs/toolkit'

// refucers
import playbackReducer from './slices/playbackSlice'
import segmentReducer from './slices/segmentSlice'

export const store = configureStore({
  reducer: {
    playback: playbackReducer,
    segments: segmentReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
