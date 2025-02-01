import { useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import { selectSpeed } from "../redux/playbackSlice"
import { useSelector } from "react-redux"

const useSetSpeed = (wavesurfer: React.MutableRefObject<WaveSurfer | null>) => {
    const speed = useSelector(selectSpeed)

    // Validate the playback speed value before setting
    const validatedSpeed = Math.max(0.1, Math.min(16, speed / 100))

    // listen for playback changes
    useEffect(() => {
        wavesurfer.current?.setPlaybackRate(validatedSpeed)
    }, [validatedSpeed])
}

export default useSetSpeed
