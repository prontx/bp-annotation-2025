import { FC, useState, useEffect } from "react"

// style
import styled, { css } from "styled-components"

// redux
import { useSelector } from "react-redux"
import { selectGroupByID } from "../redux/groupingSlice"
// import { selectGroupLen } from "../../transcript/redux/transcriptSlice"

// types
import { RootState } from "../../../redux/store"
import Layer from "../../../types/Layer"


interface SpermMarkerProps extends Layer {
    groupID: string,
    // segmentHeights: number,
    segmentID: string, 
    $index: number,
}

interface StyledMarkerProps extends Layer {
    // $len: number,
    $totalHeight: number,
    $index: number,
}

const StyledMarker = styled.div<StyledMarkerProps>` ${({theme, $layer, $totalHeight}) => css`
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    z-index: 0;
    // height: 100%;
    left: calc(100% + 16px); /* Moves the marker the right of the segment */
    height: ${$totalHeight}px; /* Adjusted to span multiple segments */
    
    color:#646464;
    
    & > span {
        writing-mode: vertical-lr;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        // background: ${theme.layers[$layer].background};
        background: #1F1F1F;
        border-radius: 16px;
        display: inline-block;
        width: 32px;
        max-height: 100%;
        padding: 16px 0;
    }

    &::after {
        content: "";
        position: absolute;
        height: 100%;
        width: 1px;
        left: 50%;
        transform: translateX(-2px);
        // background: ${theme.layers[$layer].background};
        background: #2D5D7B;
        border-radius: 2px;
        top: 0;
        z-index: -1;
    }
`}`

const SpermMarker: FC<SpermMarkerProps> = ({groupID, $layer, segmentID, $index}) => {
    const group = useSelector((state: RootState) => selectGroupByID(state)(groupID))
    const [totalHeight, setTotalHeight] = useState(0)

    useEffect(() => {
        if (!group || group.startSegmentID !== segmentID) return

        const calculateHeight = () => {
            const startSegment = document.querySelector(`[data-segment-id="${group.startSegmentID}"]`)
            const endSegment = document.querySelector(`[data-segment-id="${group.endSegmentID}"]`)

            if (startSegment && endSegment) {
                const startRect = startSegment.getBoundingClientRect()
                const endRect = endSegment.getBoundingClientRect()
                setTotalHeight(endRect.bottom - startRect.top)
            }
        }

        // Initial calculation
        calculateHeight()

        // Set up resize observers
        const resizeObserver = new ResizeObserver(calculateHeight)
        const startSegment = document.querySelector(`[data-segment-id="${group.startSegmentID}"]`)
        const endSegment = document.querySelector(`[data-segment-id="${group.endSegmentID}"]`)

        if (startSegment) resizeObserver.observe(startSegment)
        if (endSegment) resizeObserver.observe(endSegment)

        return () => {
            resizeObserver.disconnect()
        }
    }, [group, segmentID])

    if (!group || group.startSegmentID !== segmentID) return null

    return (
        <StyledMarker $layer={$layer} $totalHeight={totalHeight} $index={$index}>
            <span>{group.title}</span>
        </StyledMarker>
    )
}

export default SpermMarker
