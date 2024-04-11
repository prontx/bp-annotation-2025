import React, { FC, HTMLAttributes, useEffect, useState } from "react"

// components
import Segment from "./Segment"

// styles
import styled from "styled-components"
import { scrollableBaseStyles } from "../../../style/scrollableBaseStyles"

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { selectIsEditing, selectSelecting, chooseSegment, selectStartEndSegmentIDs } from "../../grouping/redux/groupingSlice";
import { selectSegmentIDs } from "../redux/transcriptSlice"

// types
import Layer from "../../../types/Layer"
import RegionsPlugin from "wavesurfer.js/plugins/regions"
import type { SegmentUpdateOptions } from "../types/SegmentActionPayload"


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
    const dispatch = useAppDispatch()
    const segmentIDs = useSelector(selectSegmentIDs)
    const selecting = useSelector(selectSelecting)
    const isEditing = useSelector(selectIsEditing)
    const [startIdx, setStartIdx] = useState(-1)
    const [endIdx, setEndIdx] = useState(-1)
    const [hoverIdx, setHoverIdx] = useState(-1)
    const {startSegmentID, endSegmentID} = useSelector(selectStartEndSegmentIDs)
    const [hoverID, setHover] = useState<string>("")

    useEffect(() => { // find hoverIdx when selecting
        if (!selecting)
            return
        setHoverIdx(segmentIDs.findIndex(id => id === hoverID))
    }, [selecting, segmentIDs, hoverID])
    
    useEffect(() => { // 
        if (!selecting && !isEditing)
            return

        if (startSegmentID){
            setStartIdx(segmentIDs.findIndex(id => id === startSegmentID))
        } else if (hoverID){
            setStartIdx(segmentIDs.findIndex(id => id === hoverID))
        }
        if (endSegmentID){
            setEndIdx(segmentIDs.findIndex(id => id === endSegmentID))
        } else if (hoverID){
            setEndIdx(segmentIDs.findIndex(id => id === hoverID))
        } 
    }, [segmentIDs, selecting, isEditing, hoverIdx, startSegmentID, endSegmentID])

    useEffect(() => {
        console.log(selecting, isEditing)
        if (!selecting && !isEditing){
            setStartIdx(-1)
            setEndIdx(-1)
            setHoverIdx(-1)
        }
    }, [selecting, isEditing])

    const updateWaveformRegion = (regionID: string, options: SegmentUpdateOptions) => {
        const region = waveformRegionsRef.current.getRegions().find(region => region.id === regionID)
        region?.setOptions(options)
    }
    
    return (
        <SegmentLayout $layer={$layer} {...props} onMouseLeave={() => setHover("")}>
            {segmentIDs.map((id, i) =>
                <Segment
                    key={id}
                    className={`
                        ${selecting ? "selecting" : ""}
                        ${(startIdx >= 0 && i >= startIdx && i <= endIdx) ? "ingroup" : ""}`}
                    onClick={selecting ? () => dispatch(chooseSegment({id: id})) : undefined}
                    onMouseOver={selecting ? () => setHover(id) : undefined}
                    segmentID={id}
                    $layer={$layer+1}
                    regionUpdateCallback={updateWaveformRegion}
                    regionsReloadCallback={() => waveformRegionsRef.current.clearRegions()}
                />
            )}
        </SegmentLayout>
    )
}

export default SegmentList
