import { useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import { selectIsPlaying } from "../../playback/redux/playbackSlice"
import { useSelector } from "react-redux"

const usePlayPause = (wavesurfer: React.MutableRefObject<WaveSurfer | null>) => {
    const isPlaying = useSelector(selectIsPlaying)

    // listen for playback changes
    useEffect(() => {
        if (isPlaying) {
            wavesurfer.current?.play() // TODO: .play() returns a promise
        } else {
            wavesurfer.current?.pause()
        }
    }, [isPlaying])
}

export default usePlayPause
