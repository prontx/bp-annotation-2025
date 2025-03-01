import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../../redux/store'
import { selectSegments } from '../../transcript/redux/transcriptSlice'
import { selectDuration } from '../../workspace/redux/workspaceSlice'

// slice state type
interface PlaybackState {
    isPlaying: boolean,
    currentTime: {
        value: number,
        changedBy: string
    },
    playingTo: number | null,
    speed: number,
    volume: number,
    skipLength: number,
    zoom: number
}

// initial state of the slice
const initialState: PlaybackState = {
    isPlaying: false,
    currentTime: {
        value: 0, 
        changedBy: "initial"
    },
    playingTo: null,
    speed: 100,
    volume: 1.0,
    skipLength: 3,
    zoom: 100
}

export const playbackSlice = createSlice({
    name: 'playback',
    initialState,
    reducers: {
        play: (state) => {
            state.isPlaying = true
            state.playingTo = null
        },
        pause: (state) => {
            state.isPlaying = false
        },
        playPause: (state) => {
            state.isPlaying = !state.isPlaying
        },
        playPauseSegment: (state, action: PayloadAction<{from:number, to:number, changedBy: string}>) => {
            state.currentTime.changedBy = action.payload.changedBy
            state.isPlaying = !state.isPlaying
            state.playingTo = action.payload.to
            if (state.currentTime.value <= action.payload.from || state.currentTime.value >= action.payload.to){
                state.currentTime.value = action.payload.from
            }
        },
        setTime: (state, action: PayloadAction<{value: number, changedBy: string}>) => {
            state.currentTime.value = action.payload.value
            state.currentTime.changedBy = action.payload.changedBy
        },
        skipBy: (state, action :PayloadAction<{value: number, changedBy: string}>) => {
            state.currentTime.value += action.payload.value
            state.currentTime.changedBy = action.payload.changedBy
        },
        setSpeed: (state, action: PayloadAction<number>) => {
            state.speed = action.payload
        },
        setVolume: (state, action: PayloadAction<number>) => {
            state.volume = action.payload
        },
        zoomOut: (state) => {
            if (state.zoom < 8) return
            state.zoom /= 2
        },
        zoomIn: (state) => {
            if (state.zoom > 129) return
            state.zoom *= 2
        },
        zoomScroll: (state, action) => {
            if (state.zoom > 129) return
            state.zoom *= action.payload
        },
        setSkipLength: (state, action: PayloadAction<number>) => {
            state.skipLength = action.payload
        },
    },
})

export const { play, pause, playPause, playPauseSegment, setTime, skipBy, setSpeed, setVolume, zoomIn, zoomOut, zoomScroll, setSkipLength } = playbackSlice.actions

export const selectIsPlaying = (state: RootState) => state.playback.isPlaying
export const selectCurrentTimeValue = (state: RootState) => state.playback.currentTime.value
export const selectCurrentTimeChangedBy = (state: RootState) => state.playback.currentTime.changedBy
export const selectPlayingTo = (state: RootState) => state.playback.playingTo
export const selectSpeed = (state: RootState) => state.playback.speed
export const selectVolume = (state: RootState) => state.playback.volume
export const selectZoom = (state: RootState) => state.playback.zoom
export const selectSkipLength = (state: RootState) => state.playback.skipLength
export const selectCurrentlyPlayingSegmentID = createSelector(
    [selectCurrentTimeValue, selectSegments],
    (time, segments) => {
        for (let key of segments.keys){
            const segment = segments.entities[key]
            if (!segment)
                continue

            if (segment.start < time && segment.end > time){
                return key
            } else if (segment.start > time){
                break
            } else if (segment.end < time){
                continue
            }
        }
        return undefined
    }
)
export const selectClosestRedionsStarts = createSelector(
    [selectSegments, selectCurrentTimeValue, selectDuration],
    (segments, currentTime, duration) => {
        let prevStart = 0
        let nextStart = duration
        for (let key of segments.keys){
            const segment = segments.entities[key]
            if (!segment)
                continue

            const t = segment.start
            if (t < currentTime){
                prevStart = t
            } else if (t > currentTime){
                nextStart = t
                break
            }
        }
        return [prevStart, nextStart]
    }
)

export default playbackSlice.reducer
