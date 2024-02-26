import { FC } from "react"

// components
import Segment from "./Segment"

// redux
import { useSelector } from "react-redux"
import { selectSegments } from "../redux/transcriptSlice"

// types
import Layer from "../../../style/Layer"

// styles
import styled from "styled-components"


const SegmentLayout = styled.div<Layer>`
    background: ${({theme, layer}) => theme.layers[layer].background};
`

const SegmentList: FC<Layer> = ({layer}) => {
    const segments = useSelector(selectSegments)

    return (
        <SegmentLayout layer={layer}>
            {segments && segments.map(segment => <Segment className="segment" key={segment.id} data={segment} layer={layer} />)}
        </SegmentLayout>
    )
}

export default SegmentList
