// import { useEffect } from "react"
import WaveSurfer from "wavesurfer.js"
import RegionsPlugin from "wavesurfer.js/plugins/regions"
import { useSelector } from "react-redux/es/hooks/useSelector"
import { selectLength } from "../../../redux/slices/playbackSlice"

const useZoomByRegion = (wavesurfer: React.MutableRefObject<WaveSurfer | null>, minimapRegions: React.MutableRefObject<RegionsPlugin>) => {
    const duration = useSelector(selectLength)
    
    minimapRegions.current.on("region-updated", (region) => {
        if (!wavesurfer.current) return // TODO: throw error
        
        const minimapContainerElement = document.getElementById("minimap")
        if (!minimapContainerElement) return // TODO: throw error
        
        const { start, end } = region // max end value is audio length in seconds
        const widthPixels = minimapContainerElement.clientWidth - 8 // subtract padding
        
        const factor =  duration / (end - start)
        const minPxPerSec = factor * widthPixels/duration // width of <div> in px / duration in seconds
        
        wavesurfer.current.zoom(minPxPerSec)
    })
}

export default useZoomByRegion
