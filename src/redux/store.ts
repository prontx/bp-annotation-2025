import { configureStore } from '@reduxjs/toolkit'

// refucers
import playbackReducer from './slices/playbackSlice'

export const store = configureStore({
  reducer: {
    playback: playbackReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
