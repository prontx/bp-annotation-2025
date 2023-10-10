import { FC, useRef, useEffect } from "react";
// import { useCallback } from "react";

// state management
import { useAppDispatch } from "../../../redux/hooks";
import { setTime, setLength } from "../../../redux/slices/playbackSlice";

// hooks
import usePlayPause from "./usePlayPause"
import useCurrentTimeChanges from "./useCurrentTimeChanges"
import useSetSpeed from "./useSetSpeed"

// wavesurfer
import WaveSurfer from "wavesurfer.js";
import Timeline from "wavesurfer.js/plugins/timeline"
import RegionsPlugin from "wavesurfer.js/plugins/regions"
import Minimap from "wavesurfer.js/plugins/minimap"

// custom options
import { wavesurferOptions, minimapOptions, timelineOptions } from "./wavesurferOptions"

// styles
import WaveformContainer from "./WaveformContainer"
import MinimapContainer from "./MinimapContainer"

const Waveform : FC = () => {
    const wavesurfer = useRef<WaveSurfer | null>(null)
    const dispatch = useAppDispatch()
    
    // initialize wavesurfer and all plugins
    useEffect(() => {
        if (!wavesurfer.current) {
            wavesurfer.current = WaveSurfer.create({ ...wavesurferOptions, plugins: [Timeline.create(timelineOptions)] })
        }
        
        const unsubscribe = wavesurfer.current.on('timeupdate', (currentTime) => dispatch(setTime({value: currentTime, changedBy: "wavesurfer"})))
        wavesurfer.current.once('ready', () => {
            if (!wavesurfer.current) return // TODO: throw error
            dispatch(setLength(wavesurfer.current.getDuration()))
        })

        // create minimap with regions
        const regions = RegionsPlugin.create()
        const minimap = Minimap.create({ ...minimapOptions, plugins: [ regions ] })
        wavesurfer.current.registerPlugin(minimap)
        minimap.on("ready", () => {
            regions.addRegion({ start: 100, end: 300, color: "rgba(168, 168, 168, 0.33)" })
        })

        return () => {
            unsubscribe()
            // undergister all plugins to prevent rerenders
            wavesurfer.current?.getActivePlugins().forEach((plugin) => {
                plugin.destroy()
            })
        }
    }, [wavesurfer])

    // react to global state changes
    usePlayPause(wavesurfer)
    useCurrentTimeChanges(wavesurfer)
    useSetSpeed(wavesurfer)

    return <WaveformContainer>
        <MinimapContainer>
            <div id="minimap"></div>
        </MinimapContainer>
        <div id="waveform"></div>
        <div id="timeline"></div>
    </WaveformContainer>
}

export default Waveform;

// seekTo(progress) - Seek to a percentage of audio as <0,1>
// setTime(seconds) - Jumpt to a specific time in the audio
// setVolume(number) - Set the audio volume
// zoom(minPxPerSec) - Zoom the waveform by a given pixels-per-second factor