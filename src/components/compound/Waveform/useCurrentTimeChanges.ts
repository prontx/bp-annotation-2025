import { useEffect } from "react"
import { useSelector } from "react-redux"
import WaveSurfer from "wavesurfer.js"
import { selectCurrentTimeChangedBy, selectCurrentTimeValue } from "../../../redux/slices/playbackSlice";

const useCurrentTimeChanges = (wavesurfer: React.MutableRefObject<WaveSurfer | null>) => {
    const currentTimeValue = useSelector(selectCurrentTimeValue)
    const currentTimeChangedBy = useSelector(selectCurrentTimeChangedBy)

    // if wavesurfer is not the source of the change update current time
    useEffect(() => {
        if (currentTimeChangedBy === "wavesurfer") return
        wavesurfer.current?.setTime(currentTimeValue)
    }, [currentTimeValue, currentTimeChangedBy])
}

export default useCurrentTimeChanges

// git reset --soft HEAD
// git add .
// git commit -m "commit message"