import { useEffect, useRef } from "react";

// wavesurfer
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/plugins/regions"
import Timeline from "wavesurfer.js/plugins/timeline"
import Minimap from "wavesurfer.js/plugins/minimap"

// config
import { minimapOptions, timelineOptions, wavesurferOptions } from "../config/wavesurferOptions"

// redux
import { useAppDispatch } from "../../../redux/hooks";
import { useSelector } from "react-redux";
import { selectZoom } from "../../playback/redux/playbackSlice";
import { setTime } from "../../playback/redux/playbackSlice";
import { selectAudioURL, selectDuration, selectJobStatus } from "../../job/redux/jobSlice";


const useWavesurfer = (wavesurfer: React.MutableRefObject<WaveSurfer | null>,
                        waveformRegionsRef: React.MutableRefObject<RegionsPlugin>) => {
    const dispatch = useAppDispatch()
    const zoom = useSelector(selectZoom)
    const minimapRegions = useRef<RegionsPlugin>(RegionsPlugin.create())
    const jobStatus = useSelector(selectJobStatus)
    const audioURL = useSelector(selectAudioURL)
    const duration = useSelector(selectDuration)

    useEffect(() => {
        // wait until job loads
        if (jobStatus === "idle" || jobStatus === "loading" || jobStatus === "error")
            return

        // create minimap
        const minimap = Minimap.create({ ...minimapOptions, plugins: [ minimapRegions.current ] })
        
        // create wavesurfer unless it already exists
        if (!wavesurfer.current) {
            wavesurfer.current = WaveSurfer.create({
                ...wavesurferOptions,
                duration: duration,
                url: audioURL,
                plugins: [
                    Timeline.create(timelineOptions),
                    waveformRegionsRef.current,
                    minimap,
                ]
            })
        }
        
        // sync time from player to store
        const unsubscribe = wavesurfer.current.on('timeupdate', (currentTime) => {
            dispatch(setTime({value: currentTime, changedBy: "wavesurfer"}))
        })

        // set initial zoom
        wavesurfer.current.once('ready', () => {
            wavesurfer.current?.zoom(zoom)
            waveformRegionsRef.current.enableDragSelection({})
        })
               
        // TODO: minimap initial setup, use .once (?)
        // minimap.on("ready", () => {})
            
        return unsubscribe
    }, [jobStatus])
}

export default useWavesurfer
