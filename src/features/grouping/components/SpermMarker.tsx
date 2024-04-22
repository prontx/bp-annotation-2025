import { FC } from "react"

// style
import styled, { css } from "styled-components"

// redux
import { useSelector } from "react-redux"
import { selectGroupByID, selectGroupLen } from "../redux/groupingSlice"

// types
import { RootState } from "../../../redux/store"
import Layer from "../../../types/Layer"


interface SpermMarkerProps extends Layer {
    groupID: string,
}

interface StyledMarkerProps extends Layer {
    $len: number,
}

const StyledMarker = styled.div<StyledMarkerProps>` ${({theme, $layer, $len}) => css`
    border-radius: 16px;
    grid-row: span ${$len};
    overflow: hidden;
    position: relative;
    z-index: 0;
    
    & > span {
        writing-mode: vertical-lr;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background: ${theme.layers[$layer].background};
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
        width: 4px;
        left: 50%;
        transform: translateX(-2px);
        background: ${theme.layers[$layer].background};
        border-radius: 2px;
        top: 0;
        z-index: -1;
    }
`}`

const SpermMarker: FC<SpermMarkerProps> = ({groupID, $layer}) => {
    const group = useSelector((state: RootState) => selectGroupByID(state, groupID))
    const groupLen = useSelector((state: RootState) => selectGroupLen(state, group?.startSegmentID, group?.endSegmentID))

    if (!group)
        return null

    return (
        <StyledMarker $layer={$layer} $len={groupLen}>
            <span>
                {group.title}
            </span>
        </StyledMarker>
    )
}

export default SpermMarker
