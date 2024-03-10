import React, { FC } from "react"

// components
import Segment from "./Segment"

// redux
import { useSelector } from "react-redux"
import { selectSegmentIDs } from "../redux/transcriptSlice"

// types
import Layer from "../../../types/Layer"
import RegionsPlugin from "wavesurfer.js/plugins/regions"
import type { SegmentUpdateOptions } from "../types/SegmentActionPayload"

// styles
import styled from "styled-components"


interface SegmentLayoutProps extends Layer {
    waveformRegionsRef: React.MutableRefObject<RegionsPlugin>
}

const SegmentLayout = styled.div<Layer>`
    background: ${({theme, layer}) => theme.layers[layer].background};
`

const SegmentList: FC<SegmentLayoutProps> = ({waveformRegionsRef, layer}) => {
    const segmentIDs = useSelector(selectSegmentIDs)

    const updateWaveformRegion = (regionID: string, options: SegmentUpdateOptions) => {
        const region = waveformRegionsRef.current.getRegions().find(region => region.id === regionID)
        region?.setOptions(options)
    }
    
    return (
        <SegmentLayout layer={layer}>
            {segmentIDs && segmentIDs.map(id => <Segment regionUpdateCallback={updateWaveformRegion} regionsReloadCallback={() => waveformRegionsRef.current.clearRegions()} className="segment" key={id} segmentID={id} layer={layer} />)}
        </SegmentLayout>
    )
}

export default SegmentList
