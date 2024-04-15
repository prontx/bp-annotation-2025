import { FC, useEffect, useState } from "react"

// components
import Button from "../../../components/Button"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SegmentActions from "./SegmentActions";
import DropdownSelection from "../../../components/DropdownSelection/DropdownSelection"
import TimeRange from "./TimeRange";
import SegmentText from "./SegmentText";

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { deleteSegment, mergeSegment, selectSegmentByID, updateSegment } from "../redux/transcriptSlice";
import { playPauseSegment, selectIsPlaying } from "../../playback/redux/playbackSlice";
import { selectSpeaker2Color, selectSpeakers } from "../../job/redux/jobSlice";
import { selectStartEndSegmentIDs } from "../../grouping/redux/groupingSlice";

// utils
// @ts-ignore
import { rgba } from "@carbon/colors"

// styles
import styled, { css } from "styled-components";

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

const SegmentLayout = styled.div<Layer>` ${({theme, $layer}) => css`
    padding: 4px;
    border-radius: 4px;
    background: ${theme.layers[$layer].background};
    
    &.selecting:hover {
        cursor: pointer;
        background: ${theme.layers[$layer].hover};
        outline: 2px solid ${theme.layers[$layer]["primary"].active};
        
        * {
            pointer-events: none;
            background: none;
        }
    }
    
    &.selected {
        outline: 2px solid ${theme.layers[$layer]["primary"].active};
    }

    &.ingroup {
        background: ${theme.layers[$layer].hover};

        * {
            background: none;
        }
    }
`}`

const Segment: FC<SegmentProps> = ({segmentID, $layer, regionUpdateCallback, regionsReloadCallback, className, ...props}) => {
    const data = useSelector((state: RootState) => selectSegmentByID(state, segmentID))
    const dispatch = useAppDispatch()
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const isAudioPlaying = useSelector(selectIsPlaying)
    const speakers = useSelector(selectSpeakers)
    const speaker2color = useSelector(selectSpeaker2Color)
    const {startSegmentID, endSegmentID} = useSelector(selectStartEndSegmentIDs)

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

    const handleTextChange = (text: string) => {
        dispatch(updateSegment({
            type: "id",
            key: segmentID,
            change: {words: text},
        }))
    }

    // TODO: implement group visualisation on the side

    if (!data)
        return null
    
    return (
        <SegmentLayout
            $layer={$layer}
            className={`${className} ${(segmentID === startSegmentID || segmentID === endSegmentID) ? "selected" : ""}`}
            {...props}>
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
            <div style={{display: "flex"}}>
                <Button
                    $layer={$layer}
                    onClick={handlePlayPause}
                    icon={isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
                />
                <SegmentText
                    segmentID={segmentID}
                    words={data.words}
                    $layer={$layer}
                    changeHandler={handleTextChange}
                />
            </div>
        </SegmentLayout>
    )
}

export default Segment
