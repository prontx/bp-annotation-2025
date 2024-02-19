import { FC } from "react"

// components
import Segment from "./components/Segment"

// test data
// import testSegments from "../../../testing/test_segments.json"
import testSegments from "../../../testing/segments.json"

// redux
import { loadSegments, selectSegments } from "../../../redux/slices/segmentSlice"
import { useAppDispatch } from "../../../redux/hooks"
import { useSelector } from "react-redux"

// types
import Layer from "../../../style/Layer"

// styles
import styled from "styled-components"

const SegmentLayout = styled.div<Layer>`
    background: ${({theme, layer}) => theme.layers[layer].background};
`

const SegmentList: FC<Layer> = ({layer}) => {
    const dispatch = useAppDispatch()
    const segments = useSelector(selectSegments)
    if (segments.ids.length === 0) { // TODO: implement real loading
        dispatch(loadSegments(testSegments.segments))
    }

    return (
        <SegmentLayout layer={layer}>
            {segments.ids.map(segmentId => <Segment className="segment" key={segmentId} idx={segmentId} layer={layer} />)}
        </SegmentLayout>
    )
}

export default SegmentList
