import { FC, useEffect, useState } from "react"

// components
import Button from "../../../components/Button"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SegmentActions from "./SegmentActions";
import DropdownSelection from "../../../components/DropdownSelection/DropdownSelection"
import TimeRange from "./TimeRange";

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { deleteSegment, mergeSegment, selectSegmentByID, updateSegment } from "../redux/transcriptSlice";
import { playPauseSegment, selectIsPlaying } from "../../playback/redux/playbackSlice";
import { selectSelecting, chooseSegment } from "../../grouping/redux/groupingSlice";
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
    padding: 4px;
    border-radius: 4px;
    background: ${({theme, $layer}) => theme.layers[$layer].background};

    grid-template-areas:
        "header tags"
        "body tags";
    
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
    const dispatch = useAppDispatch()
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const isAudioPlaying = useSelector(selectIsPlaying)
    const selecting = useSelector(selectSelecting)
    const speakers = useSelector(selectSpeakers)
    const speaker2color = useSelector(selectSpeaker2Color)

    useEffect(() => {
        if (!isAudioPlaying && isPlaying)
            setIsPlaying(false)
    }, [isAudioPlaying])
    
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

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
        dispatch(playPauseSegment({from: data.start, to: data.end, changedBy: `segment:${segmentID}`}))
    }

    // TODO: implement group visualisation on the side

    if (!data)
        return null
    
    return (
        <SegmentLayout
            $layer={$layer}
            {...props}
            className={selecting ? "selecting" : ""}
            onClick={selecting ? () => dispatch(chooseSegment({id: segmentID})) : undefined}
        >
            <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
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
                    style={{marginLeft: "auto"}}
                    $layer={$layer}
                    deleteHandler={() => dispatch(deleteSegment({id: segmentID, callback: regionsReloadCallback}))}
                    mergeHandler={() => dispatch(mergeSegment({id: segmentID}))}
                />
            </div>
            <div style={{marginRight: "auto", display: "flex"}}>
                <Button
                    $layer={$layer}
                    onClick={handlePlayPause}
                    style={{margin: "0 4px auto 4px"}}
                    icon={isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
                />
                <p>{segmentWords2String(data.words) /* TODO, FIXME: use text editor with tag support etc. */}</p>
            </div>
        </SegmentLayout>
    )
}

export default Segment
