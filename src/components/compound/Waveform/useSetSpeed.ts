import { useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import { selectSpeed } from "../../../redux/slices/playbackSlice"
import { useSelector } from "react-redux"

const usePlayPause = (wavesurfer: React.MutableRefObject<WaveSurfer | null>) => {
    const speed = useSelector(selectSpeed)

    // listen for playback changes
    useEffect(() => {
        wavesurfer.current?.setPlaybackRate(speed)
    }, [speed])
}

export default usePlayPause
