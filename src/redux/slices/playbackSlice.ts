import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// slice state type
interface PlaybackState {
    isPlaying: boolean,
    currentTime: number,
    playingTo: number | null,
    speed: number,
    volume: number
}

// initial state of the slice
const initialState: PlaybackState = {
    isPlaying: false,
    currentTime: 0,
    playingTo: null,
    speed: 1.0,
    volume: 100
}

export const playbackSlice = createSlice({
    name: 'playback',
    initialState,
    reducers: {
        play: (state) => {
            state.isPlaying = true
            playingTo: null
        },
        pause: (state) => {
            state.isPlaying = false
        },
        playSegment: (state, action: PayloadAction<{from:number, to:number}>) => {
            state.isPlaying = true
            state.currentTime = action.payload.from
            state.playingTo = action.payload.to
        },
        setTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload
        },
        skipForward: (state) => {
            state.currentTime += 1
        },
        skipBackward: (state) => {
            if (state.currentTime < 1){
                state.currentTime = 0
            } else {
                state.currentTime -= 1
            }
        },
        skipToStart: (state) => {
            state.currentTime = 0
        },
        skipToEnd: (state) => {
            // TODO: load actual audio length from metadata
            state.currentTime = 42
        },
        setSpeed: (state, action: PayloadAction<number>) => {
            state.speed = action.payload
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload
        },
    },
})

export const { play, pause, setSpeed, setVolume, setTime, skipToStart, skipToEnd, skipForward, skipBackward } = playbackSlice.actions

export const selectPlaying = (state: RootState) => state.playback.isPlaying
export const selectCurrentTime = (state: RootState) => state.playback.currentTime
export const selectPlayingTo = (state: RootState) => state.playback.playingTo
export const selectSpeed = (state: RootState) => state.playback.speed
export const selectVolume = (state: RootState) => state.playback.volume

export default playbackSlice.reducer
