import { useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import { selectVolume } from "../../../redux/slices/playbackSlice"
import { useSelector } from "react-redux"

const usePlayPause = (wavesurfer: React.MutableRefObject<WaveSurfer | null>) => {
    const volume = useSelector(selectVolume)

    // listen for playback changes
    useEffect(() => {
        wavesurfer.current?.setVolume(volume)
    }, [volume])
}

export default usePlayPause
