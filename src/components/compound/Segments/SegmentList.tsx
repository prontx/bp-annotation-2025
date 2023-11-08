import { FC, ReactElement } from "react"

// components
import Segment from "./components/Segment"
import Group from "./components/Group"
import AddOptions from "./components/AddOptions"

// test data
import testSegments from "../../../testing/test_segments.json"

// redux
import { loadSegments, selectIds, selectSegments } from "../../../redux/slices/segmentSlice"
import { useAppDispatch } from "../../../redux/hooks"
import { useSelector } from "react-redux"

// types
import Layer from "../../../style/Layer"
import { EntityId } from "@reduxjs/toolkit"

// styles
import styled from "styled-components"

const SegmentLayout = styled.div<Layer>`
    display: grid;
    grid-template-columns: 70% 30%;
    grid-template-rows: repeat(autofill, min-content);
    background: ${({theme, layer}) => theme.layers[layer].background};
    align-items: start;
    /* min-height: 100%; */

    & .segment {
        grid-column: 1 / 2;
    }

    & .group {
        grid-column: 2 / -1;
    }
`

const SegmentList: FC<Layer> = ({layer}) => {
    const dispatch = useAppDispatch()
    const segments = useSelector(selectSegments)
    if (segments.ids.length === 0) { // TODO: implement real loading
        dispatch(loadSegments(testSegments.segments))
    }
    const segmentIds = useSelector(selectIds)

    const getGroupLen = (idx: EntityId) => {
        let len = 1
        for (let id_idx = segmentIds.indexOf(idx) + 1; true; id_idx++) {
            const currentSegment = segments.entities[segmentIds[id_idx]]

            if (currentSegment === undefined) {
                return 1
            }
            else if (currentSegment.group_tags.length === 0) {
                return 1
            }
            else if (currentSegment.group_tags[0] == "!START_group") {
                return len
            }
            else if (currentSegment.group_tags[0] == "!IN_group") {
                len++
            }
            else if (currentSegment.group_tags[0] == "!END_group") {
                return len + 1
            }
        }
    }

    const getGroup = (segmentId: EntityId) => {
        let element: ReactElement | null = null
        const segment = segments.entities[segmentId]

        if (segment === undefined){
            element = null
        }
        else if (segment.group_tags.length === 0){
            element =  <AddOptions key={`addOpt_${segmentId}`} layer={layer} idx={segmentId} />
        }
        else if (segment.group_tags[0] === "!START_group"){
            element = <Group key={`group_${segmentId}`} layer={layer} className="group" idx={segmentId} span={getGroupLen(segmentId)} />
        }

        return element
    }
    
    return (
        <SegmentLayout layer={layer}>
            {segments.ids.map(segmentId => (
                    <>
                        <Segment className="segment" key={segmentId} idx={segmentId} layer={layer} />
                        {getGroup(segmentId)}
                    </>
                )
            )}
        </SegmentLayout>
    )
}

export default SegmentList
