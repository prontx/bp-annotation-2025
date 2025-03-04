import { WaveSurferOptions } from "wavesurfer.js";
import { MinimapPluginOptions } from "wavesurfer.js/plugins/minimap"

export const wavesurferOptions : WaveSurferOptions = {
    normalize: true,
    waveColor: '#FB3640',
    progressColor: '#8d8d8d',
    cursorColor: '#ff0000',
    cursorWidth: 2,
    interact: true,
    autoScroll: true,
    autoCenter: false,
    container: '#waveform',
    height: 80,
}

export const minimapOptions : MinimapPluginOptions = { 
    normalize: true,
    waveColor: '#FB3640',
    progressColor: '#8d8d8d',
    cursorColor: '#ff0000',
    cursorWidth: 2,
    hideScrollbar: true,
    height: 44,
    container: '#minimap',
    interact: true,
    overlayColor: "#6f6f6f",
}

export const timelineOptions = {
    height: 5,
    style: {
        color: '#FB3640'
    },
}
