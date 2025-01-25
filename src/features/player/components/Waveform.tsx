import { FC, useRef } from "react"

// hooks
import useWavesurfer from "../hooks/useWavesurfer"
import useLoadRegions from "../hooks/useLoadRegions"
import usePlayPause from "../hooks/usePlayPause"
import useReactToTimeChanges from "../hooks/useReactToTimeChanges"
import useSetSpeed from "../hooks/useSetSpeed"
import useSetVolume from "../hooks/useSetVolume"
import useSetZoom from "../hooks/useSetZoom"

// wavesurfer
import WaveSurfer from "wavesurfer.js"
import RegionsPlugin from "wavesurfer.js/plugins/regions"

// styles
import styled, { css } from "styled-components"

// types
import type Layer from "../../../types/Layer"

import { useSelector } from "react-redux";
import { selectJobStatus } from "../../workspace/redux/workspaceSlice";
import { ClipLoader } from 'react-spinners';

interface WaveformProps extends React.HTMLAttributes<HTMLDivElement>, Layer {
    waveformRegionsRef: React.MutableRefObject<RegionsPlugin>
}

const WaveformContainer = styled.div<Layer>` ${({theme, $layer}) => css`
    padding: 8px 8px 0 8px;
    background: ${theme.layers[$layer].background};
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    
    #waveform {
        padding: 0 4px;
        background: ${theme.layers[$layer+1].background};
        border-radius: 4px;
        height: 96px;
    }
`}`

const MinimapContainer = styled.div<Layer>` ${({theme, $layer}) => css`
    background:  ${theme.layers[$layer].background};
    margin-bottom: 8px;
    
    #minimap {
        padding: 0 4px;
        border-radius: 4px;
        background: ${theme.layers[$layer+1].background};
        height: 40px; /* visualization height + timeline height */
    }
`}`

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

    const jobStatus = useSelector(selectJobStatus)

    if (jobStatus === "loading") {
            return (
                <div>
                    <ClipLoader color={"#36d7b7"} loading={true} size={150} />
                </div>
            )  
    }  

    return <WaveformContainer $layer={$layer} {...props}>
        <MinimapContainer $layer={$layer}>
            <div id="minimap"></div>
        </MinimapContainer>
        <div id="waveform"></div>
    </WaveformContainer>
}

export default Waveform;
