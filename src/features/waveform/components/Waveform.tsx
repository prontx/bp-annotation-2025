import { FC, useRef } from "react";
// hooks
import useWavesurfer from "../hooks/useWavesurfer";
import useLoadRegions from "../hooks/useLoadRegions";
import usePlayPause from "../hooks/usePlayPause"
import useReactToTimeChanges from "../hooks/useReactToTimeChanges"
import useSetSpeed from "../hooks/useSetSpeed"
import useSetVolume from "../hooks/useSetVolume";
import useSetZoom from "../hooks/useSetZoom";

// wavesurfer
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/plugins/regions"

// styles
import WaveformContainer from "../style/WaveformContainer"
import MinimapContainer from "../style/MinimapContainer"

// types
import type Layer from "../../../types/Layer";


interface WaveformProps extends React.HTMLAttributes<HTMLDivElement>, Layer {
    waveformRegionsRef: React.MutableRefObject<RegionsPlugin>
}

const Waveform : FC<WaveformProps> = ({$layer, waveformRegionsRef, ...props}) => {
    const wavesurfer = useRef<WaveSurfer | null>(null)

    // setup and load waveform with plugins
    useWavesurfer(wavesurfer, waveformRegionsRef)
    useLoadRegions(wavesurfer, waveformRegionsRef)
    
    // react to global state changes
    usePlayPause(wavesurfer)
    useReactToTimeChanges(wavesurfer)
    useSetSpeed(wavesurfer)
    useSetVolume(wavesurfer)
    useSetZoom(wavesurfer)

    return <WaveformContainer $layer={$layer} {...props}>
        <MinimapContainer $layer={$layer}>
            <div id="minimap"></div>
        </MinimapContainer>
        <div id="waveform"></div>
    </WaveformContainer>
}

export default Waveform;
