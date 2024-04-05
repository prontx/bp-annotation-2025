import { FC } from "react"

// components
import Button from "../../../components/Button"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import SegmentActions from "./SegmentActions";
import DropdownSelection from "../../../components/DropdownSelection/DropdownSelection"
// import Tag from "../../../components/Tag";
import TimeRange from "./TimeRange";

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { deleteSegment, mergeSegment, selectSegmentByID, updateSegment } from "../redux/transcriptSlice";
import { playSegment } from "../../playback/redux/playbackSlice";
import { selectIsSelecting, selectSegment } from "../../grouping/redux/groupingSlice";
import { selectSpeaker2Color, selectSpeakers } from "../../job/redux/jobSlice";

// utils
import { segmentWords2String } from "../../../utils/segmentWords2String";
// @ts-ignore
import { rgba } from "@carbon/colors"

// styles
import styled from "styled-components";

// types
import type Layer from "../../../types/Layer"
import type { Segment } from "../types/Segment";
import type { RootState } from "../../../redux/store";
import type { SegmentUpdateOptions } from "../../transcript/types/SegmentActionPayload";
import { SpeakerTag } from "../types/Tag";


interface SegmentProps extends Layer, React.HTMLAttributes<HTMLDivElement> {
    segmentID: string,
    regionUpdateCallback: (regionID: string, options: SegmentUpdateOptions) => void,
    regionsReloadCallback: () => void
}

const SegmentLayout = styled.div<Layer>`
    display: grid;
    gap: 4px;
    padding: 4px;
    border-radius: 4px;
    background: ${({theme, $layer}) => theme.layers[$layer].background};

    grid-template-areas:
        "header tags"
        "body tags";
    
    & button {
        margin: auto;
    }
    
    &.selecting {
        & > * {
            pointer-events: none;
            background: transparent;
        }
        &:hover {
            border-radius: 4px;
            cursor: pointer;
            background: ${({theme, $layer}) => theme.layers[$layer].hover}
        }
    }
`

const Segment: FC<SegmentProps> = ({segmentID, $layer, regionUpdateCallback, regionsReloadCallback, ...props}) => {
    const data = useSelector((state: RootState) => selectSegmentByID(state, segmentID))

    if (!data)
        return null
    
    const dispatch = useAppDispatch()
    const isSelecting = useSelector(selectIsSelecting)
    const speakers = useSelector(selectSpeakers)
    const speaker2color = useSelector(selectSpeaker2Color)
    
    const handleSpeakerChange = (newTag: SpeakerTag) => {
        dispatch(updateSegment({
            type: "id",
            key: segmentID,
            change: {speaker: newTag.id},
            callback: (regionID, _) => {
                regionUpdateCallback(regionID, {
                    start: data.start,
                    color: rgba(speaker2color[newTag.id] || "#c6c6c6", 0.4),
                })
            }
        }))
    }
    
    const handleTimeRangeChange = (change: {start?: number, end?: number}) => {
        dispatch(updateSegment({type: "id", key: segmentID, change: change, callback: regionUpdateCallback}))
    }

    const handleDeletion = () => {
        dispatch(deleteSegment({id: segmentID, callback: regionsReloadCallback}))
    }
    
    const handleMerge = () => {
        console.log("> merge segment from Segment")
        dispatch(mergeSegment({id: segmentID}))
    }

    const handlePlay = () => {
        dispatch(playSegment({from: data.start, to: data.end, changedBy: `segment:${segmentID}`}))
    }

    const handleSelectingSegment = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault()
        if (!isSelecting)
            return
        
        dispatch(selectSegment(segmentID))
    }

    // TODO: implement segment tags
    // TODO: implement group visualisation on the side

    return (
        <SegmentLayout
            $layer={$layer}
            {...props}
            className={isSelecting ? "selecting" : ""}
            onClick={isSelecting ? (e) => handleSelectingSegment(e) : () => {}}
        >
            <div style={{display: "flex", gap: "8px", marginRight: "auto", alignItems: "center"}}>
                <DropdownSelection<SpeakerTag>
                    $layer={$layer+1}
                    onSelection={handleSpeakerChange}
                    initialState={speakers.find(speaker => speaker.id === data.speaker)}
                    options={speakers}
                />
                <TimeRange
                    start={data.start}
                    end={data.end}
                    $layer={$layer+1}
                    changeHandler={handleTimeRangeChange}
                />
                <SegmentActions
                    $layer={$layer}
                    deleteHandler={handleDeletion}
                    mergeHandler={handleMerge}
                />
            </div>
            <div>
                {/* TODO: tags */}
                {/* TODO: get tag display text based on tag text */}
                {/* <TagArea tags={segment.segment_tags} placeholder="" $layer={$layer} span={1} onTagAdd={() => {}} onTagDelete={() => {}} /> */}
            </div>
            <div style={{marginRight: "auto", display: "flex"}}>
                <Button $layer={$layer} onClick={handlePlay} style={{margin: "0 4px auto 4px"}}>
                    <PlayArrowRoundedIcon />
                </Button>
                <p>{segmentWords2String(data.words) /* TODO, FIXME: use text editor with tag support etc. */}</p>
            </div>
        </SegmentLayout>
    )
}

export default Segment
