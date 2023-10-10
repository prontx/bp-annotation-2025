import { WaveSurferOptions } from "wavesurfer.js";
import { MinimapPluginOptions } from "wavesurfer.js/plugins/minimap"

export const wavesurferOptions : WaveSurferOptions = {
    normalize: true,
    waveColor: '#6f6f6f',
    progressColor: '#6f6f6f',
    cursorColor: '#ff0000',
    cursorWidth: 2,
    interact: true,
    hideScrollbar: true,
    autoScroll: true,
    autoCenter: true,
    container: '#waveform',
    height: "auto",
    url: 'https://thepaciellogroup.github.io/AT-browser-tests/audio/jeffbob.mp3',
}

export const minimapOptions : MinimapPluginOptions = { 
    normalize: true,
    waveColor: '#6f6f6f',
    progressColor: '#6f6f6f',
    cursorColor: '#ff0000',
    cursorWidth: 2,
    hideScrollbar: true,
    height: 20,
    container: '#minimap',
    interact: false,
}

export const timelineOptions = {
    container: "#timeline",
    height: 16,
    style: {
        color: '#c6c6c6'
    },
}