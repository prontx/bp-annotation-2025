import { FC } from "react"

// components
import Button from "../../../basic/Button/Button"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SubtleInput from "../../../basic/SubtleInput/SubtleInput";
import DropdownSelection from "../../../basic/DropdownSelection/DropdownSelection";
import Tag from "../../../basic/Tag/Tag";

// utils
import { timeToFormatedString } from "../../../../utils/convertTimeAndFormatedString"

// types
import Layer from "../../../../style/Layer"
import { EntityId } from "@reduxjs/toolkit"
import { RootState } from "../../../../redux/store"

// redux
import { useSelector } from "react-redux"
import { selectSegmentById } from "../../../../redux/slices/segmentSlice"
import { useAppDispatch } from "../../../../redux/hooks"

// styles
import styled from "styled-components";


const SegmentLayout = styled.div<Layer>`
    display: flex;
    gap: 24px;
    padding: 4px;
    border-bottom: 1px solid ${({theme, layer}) => theme.layers[layer].active};
    align-items: center;

    & button {
        margin: auto;
    }
`

const Segment: FC<{idx: EntityId} & Layer & React.HTMLAttributes<HTMLDivElement>> = ({idx, layer, ...props}) => {
    const dispatch = useAppDispatch()
    const { id, segment } = useSelector((state: RootState) => selectSegmentById(state, idx))

    if (segment === undefined || segment === null ) return

    return (
        <SegmentLayout layer={layer} {...props}>
            <Button variant="icon" layer={layer} onClick={() => {}}>
                <PlayArrowRoundedIcon />
            </Button>
            <div>
                <SubtleInput layer={layer+1} type="text" value={timeToFormatedString(segment.start)} />
                <SubtleInput layer={layer+1} type="text" value={timeToFormatedString(segment.end)} />
            </div>
            <div>
                {/* TOOD: fix segment options, onSelection */}
                {/* <DropdownSelection layer={layer} onSelection={() => {}} variant="text" initialState={123} options={[456, 789, 420]}/>  */}
                <p>Speaker{segment.speaker}<span className="dropdownArrow" aria-hidden>▾</span></p>
            </div>

            {/* TODO: get tag display text based on tag text */}
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet, qui inventore dolore quod officia itaque non ratione recusandae debitis reiciendis!</p>
            <p style={{margin: "4px"}}>{segment.segment_tags.map(t => <Tag layer={layer+1}>{t}</Tag>)}</p>
        </SegmentLayout>
    )
}

export default Segment
