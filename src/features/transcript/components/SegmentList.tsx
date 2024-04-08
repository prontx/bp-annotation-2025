import React, { FC, HTMLAttributes } from "react"

// components
import Segment from "./Segment"

// styles
import styled from "styled-components"
import { scrollableBaseStyles } from "../../../style/scrollableBaseStyles"

// types
import Layer from "../../../types/Layer"
import RegionsPlugin from "wavesurfer.js/plugins/regions"
import type { SegmentUpdateOptions } from "../types/SegmentActionPayload"

// hooks
import { useSelectSegmentIDs } from "../hooks/useSelectSegmentIDs"


interface SegmentLayoutProps extends HTMLAttributes<HTMLElement>, Layer {
    waveformRegionsRef: React.MutableRefObject<RegionsPlugin>
}

const SegmentLayout = styled.section<Layer>`
    ${scrollableBaseStyles}

    background: ${({theme, $layer}) => theme.layers[$layer].background};
    padding: 8px;
    border-radius: 8px 8px 0 0;
    min-width: 100%;

    display: flex;
    flex-direction: column;
    gap: 2px;
`

const SegmentList: FC<SegmentLayoutProps> = ({waveformRegionsRef, $layer, ...props}) => {
    const segmentIDs = useSelectSegmentIDs()

    const updateWaveformRegion = (regionID: string, options: SegmentUpdateOptions) => {
        const region = waveformRegionsRef.current.getRegions().find(region => region.id === regionID)
        region?.setOptions(options)
    }
    
    return (
        <SegmentLayout $layer={$layer} {...props}>
            {segmentIDs.map(id => (
                <Segment
                    key={id}
                    className="segment"
                    segmentID={id}
                    $layer={$layer+1}
                    regionUpdateCallback={updateWaveformRegion}
                    regionsReloadCallback={() => waveformRegionsRef.current.clearRegions()}
                />
            ))}
        </SegmentLayout>
    )
}

export default SegmentList
