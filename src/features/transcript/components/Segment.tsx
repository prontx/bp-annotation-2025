import { FC, useEffect } from "react"

// components
import Button from "../../../components/basic/Button/Button"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SubtleInput from "../../../components/basic/SubtleInput/SubtleInput";
import SegmentActions from "../../../components/compound/Segments/components/SegmentActions";
import DropdownSelection from "../../../components/basic/DropdownSelection/DropdownSelection"

// utils
import { timeToFormatedString } from "../../../utils/convertTimeAndFormatedString"

// types
import type Layer from "../../../style/Layer"
import type { Segment } from "../types/Segment";

// styles
import styled from "styled-components";
import Tag from "../../../components/basic/Tag/Tag";
import { segmentWords2String } from "../../../utils/segmentWords2String";


interface SegmentProps extends Layer, React.HTMLAttributes<HTMLDivElement> {
    data: Segment
}

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

const Segment: FC<SegmentProps> = ({data, layer, ...props}) => {
    if (data === undefined || data === null ) return

    // TODO: implement functionality
    // TODO: how to change specific segment in the store
    // TODO: implement segment tags
    // TODO: implement group visualisation
    // TODO: fix SegmentActions

    return (
        <SegmentLayout layer={layer} {...props}>
            <div style={{display: "flex", gap: "8px", marginRight: "auto", alignItems: "center"}}>
                <DropdownSelection layer={layer+1} variant="speaker" onSelection={() => {}} initialState={0} options={[1, 2, 3]} />
                <div>
                    {/* TODO: implement onChange */}
                    <SubtleInput layer={layer+1} type="text" value={timeToFormatedString(data.start)} onChange={() => {}} />
                    –
                    {/* TODO: implement onChange */}
                    <SubtleInput layer={layer+1} type="text" value={timeToFormatedString(data.end)} onChange={() => {}} />
                </div>
                {/* <SegmentActions layer={layer} /> */}
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
                <p>{segmentWords2String(data.words) /* TODO, FIXME: use text editor with tag support etc. */}</p>
            </div>
        </SegmentLayout>
    )
}

export default Segment
