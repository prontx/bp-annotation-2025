import { useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import { selectSpeed } from "../../../redux/slices/playbackSlice"
import { useSelector } from "react-redux"

const useSetSpeed = (wavesurfer: React.MutableRefObject<WaveSurfer | null>) => {
    const speed = useSelector(selectSpeed)

    // listen for playback changes
    useEffect(() => {
        wavesurfer.current?.setPlaybackRate(speed)
    }, [speed])
}

export default useSetSpeed
