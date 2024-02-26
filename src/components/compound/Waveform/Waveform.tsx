import { FC, useRef, useEffect } from "react";
// import { useCallback } from "react";

// state management
import { useAppDispatch } from "../../../redux/hooks";
import { setTime } from "../../../features/playback/redux/playbackSlice";
import { useSelector } from "react-redux";
import { selectZoom } from "../../../features/playback/redux/playbackSlice";

// hooks
import usePlayPause from "./usePlayPause"
import useReactToTimeChanges from "./useReactToTimeChanges"
import useSetSpeed from "./useSetSpeed"
import useSetVolume from "./useSetVolume";
// import useZoomByRegion from "./useZoomByRegion";
import useSetZoom from "./useSetZoom";

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
import Layer from "../../../style/Layer";

const Waveform : FC<React.HTMLAttributes<HTMLDivElement> & Layer> = ({layer, ...props}) => {
    const wavesurfer = useRef<WaveSurfer | null>(null)
    const minimapRegions = useRef<RegionsPlugin>(RegionsPlugin.create())
    const dispatch = useAppDispatch()
    const zoom = useSelector(selectZoom)
    
    // initialize wavesurfer and all plugins
    useEffect(() => {
        const minimap = Minimap.create({ ...minimapOptions, plugins: [ minimapRegions.current ] })
        
        if (!wavesurfer.current) {
            wavesurfer.current = WaveSurfer.create({
                ...wavesurferOptions,
                plugins: [
                    Timeline.create(timelineOptions),
                    RegionsPlugin.create(),
                    minimap,
                ]
            })
        }
        
        const unsubscribe = wavesurfer.current.on('timeupdate', (currentTime) => dispatch(setTime({value: currentTime, changedBy: "wavesurfer"})))

        // TODO: update minimap region start and timeline based on scroll 👆

        wavesurfer.current.once('ready', () => {
            if (!wavesurfer.current) return // TODO: throw error
            wavesurfer.current.zoom(zoom)

            // TODO: remove temp region
            // const regions = wavesurfer.current.getActivePlugins()[1] as RegionsPlugin
            // regions.addRegion({ start: 0, end: 100, color: "rgba(128, 128, 255, 0.4)" })
        })

        minimap.on("ready", () => {
            
        })

        return () => unsubscribe()
    }, [wavesurfer])

    // react to global state changes
    usePlayPause(wavesurfer)
    useReactToTimeChanges(wavesurfer)
    useSetSpeed(wavesurfer)
    useSetVolume(wavesurfer)
    useSetZoom(wavesurfer)

    return <WaveformContainer layer={layer} {...props}>
        <MinimapContainer layer={layer}>
            <div id="minimap"></div>
        </MinimapContainer>
        <div id="waveform"></div>
    </WaveformContainer>
}

export default Waveform;

// seekTo(progress) - Seek to a percentage of audio as <0,1>
// setTime(seconds) - Jumpt to a specific time in the audio
// setVolume(number) - Set the audio volume
// zoom(minPxPerSec) - Zoom the waveform by a given pixels-per-second factor