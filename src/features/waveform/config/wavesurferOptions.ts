import { WaveSurferOptions } from "wavesurfer.js";
import { MinimapPluginOptions } from "wavesurfer.js/plugins/minimap"
import { mockWaveformRequest } from "../../../testing/mockAPI";

const testData = await mockWaveformRequest()

export const wavesurferOptions : WaveSurferOptions = {
    normalize: true,
    waveColor: '#c6c6c6',
    progressColor: '#c6c6c6',
    cursorColor: '#ff0000',
    cursorWidth: 2,
    interact: true,
    hideScrollbar: true,
    autoScroll: true,
    autoCenter: false,
    container: '#waveform',
    height: 80,
    peaks: testData,
}

export const minimapOptions : MinimapPluginOptions = { 
    normalize: true,
    waveColor: '#c6c6c6',
    progressColor: '#c6c6c6',
    cursorColor: '#ff0000',
    cursorWidth: 2,
    hideScrollbar: true,
    height: 20,
    container: '#minimap',
    interact: false,
    overlayColor: "#525252"
}

export const timelineOptions = {
    height: 16,
    style: {
        color: '#c6c6c6'
    },
}
