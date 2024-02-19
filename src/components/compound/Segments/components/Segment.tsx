import { FC } from "react"

// components
import Button from "../../../basic/Button/Button"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SubtleInput from "../../../basic/SubtleInput/SubtleInput";
import SegmentActions from "./SegmentActions";
import DropdownSelection from "../../../basic/DropdownSelection/DropdownSelection"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

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
import Tag from "../../../basic/Tag/Tag";


const SegmentLayout = styled.div<Layer>`
    display: grid;
    gap: 4px;
    margin: 0 8px;
    padding: 8px 0;
    border-bottom: 1px solid ${({theme, layer}) => theme.layers[layer].active};
    /* align-items: center; */
    grid-template-areas:
        "header tags"
        "body tags";

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
            <div style={{display: "flex", gap: "8px", marginRight: "auto", alignItems: "center"}}>
                <DropdownSelection layer={layer+1} variant="speaker" onSelection={() => {}} initialState={0} options={[1, 2, 3]} />
                <div>
                    {/* TODO: implement onChange */}
                    <SubtleInput layer={layer+1} type="text" value={timeToFormatedString(segment.start)} onChange={() => {}} />
                    –
                    {/* TODO: implement onChange */}
                    <SubtleInput layer={layer+1} type="text" value={timeToFormatedString(segment.end)} onChange={() => {}} />
                </div>
                <SegmentActions idx={id} layer={layer} />
            </div>
            <div>
                {/* TODO: tags */}
                {/* TODO: get tag display text based on tag text */}
                {/* <TagArea tags={segment.segment_tags} placeholder="" layer={layer} span={1} onTagAdd={() => {}} onTagDelete={() => {}} /> */}
            </div>
            <div style={{marginRight: "auto", display: "flex"}}>
                <Button variant="icon" layer={layer} onClick={() => {}} style={{margin: "0 4px auto 4px"}}>
                    <PlayArrowRoundedIcon />
                </Button>
                <p>{segment.words as string /* FIXME */}</p>
            </div>
        </SegmentLayout>
    )
}

export default Segment
