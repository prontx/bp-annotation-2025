import { FC } from "react"

// components
import Button from "../../../components/basic/Button/Button"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SegmentActions from "./SegmentActions";
import DropdownSelection from "../../../components/basic/DropdownSelection/DropdownSelection"
import Tag from "../../../components/basic/Tag/Tag";
import TimeRange from "./TimeRange";

// redux
import { useAppDispatch } from "../../../redux/hooks";
import { deleteSegment, mergeSegment, updateSegment } from "../redux/transcriptSlice";
import { playSegment } from "../../../redux/slices/playbackSlice";

// utils
import { segmentWords2String } from "../../../utils/segmentWords2String";

// types
import type Layer from "../../../style/Layer"
import type { Segment } from "../types/Segment";

// styles
import styled from "styled-components";


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

    const dispatch = useAppDispatch()

    const handleTimeRangeChange = (change: {start?: number, end?: number}) => {
        dispatch(updateSegment({id: data.id as string, ...change}))
    }

    const handleDeletion = () => {
        console.log("> delete segment from Segment")
        dispatch(deleteSegment({id: data.id as string}))
    }
    
    const handleMerge = () => {
        console.log("> merge segment from Segment")
        dispatch(mergeSegment({id: data.id as string}))
    }

    const handlePlay = () => {
        dispatch(playSegment({from: data.start, to: data.end, changedBy: `segment:${data.id}`}))
    }

    // TODO: implement functionality
    // TODO: implement segment tags
    // TODO: implement group visualisation on the side

    return (
        <SegmentLayout layer={layer} {...props}>
            <div style={{display: "flex", gap: "8px", marginRight: "auto", alignItems: "center"}}>
                <DropdownSelection layer={layer+1} variant="speaker" onSelection={() => {}} initialState={0} options={[1, 2, 3]} />
                <TimeRange start={data.start} end={data.end} layer={layer+1} changeHandler={handleTimeRangeChange}></TimeRange>
                <SegmentActions layer={layer} deleteHandler={handleDeletion} mergeHandler={handleMerge} />
            </div>
            <div>
                {/* TODO: tags */}
                {/* TODO: get tag display text based on tag text */}
                {/* <TagArea tags={segment.segment_tags} placeholder="" layer={layer} span={1} onTagAdd={() => {}} onTagDelete={() => {}} /> */}
            </div>
            <div style={{marginRight: "auto", display: "flex"}}>
                <Button variant="icon" layer={layer} onClick={handlePlay} style={{margin: "0 4px auto 4px"}}>
                    <PlayArrowRoundedIcon />
                </Button>
                <p>{segmentWords2String(data.words) /* TODO, FIXME: use text editor with tag support etc. */}</p>
            </div>
        </SegmentLayout>
    )
}

export default Segment
