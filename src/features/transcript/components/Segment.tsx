import { FC, useEffect, useState } from "react"

// components
import Button from "../../../components/Button"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SegmentActions from "./SegmentActions";
import DropdownSelection from "../../../components/DropdownSelection/DropdownSelection"
import SegmentText from "./SegmentText";

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { deleteSegment, mergeSegment, selectSegmentByID, updateSegment } from "../redux/transcriptSlice";
import { playPauseSegment, selectIsPlaying } from "../../playback/redux/playbackSlice";
import { selectSpeakers } from "../../job/redux/jobSlice";
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
import { SpeakerTag } from "../types/Tag";
import { time2FormatedString } from "../../../utils/time2FormatedString";


interface SegmentProps extends Layer, React.HTMLAttributes<HTMLDivElement> {
    segmentID: string,
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

const Segment: FC<SegmentProps> = ({segmentID, $layer, regionsReloadCallback, className, ...props}) => {
    const data = useSelector((state: RootState) => selectSegmentByID(state, segmentID))
    const dispatch = useAppDispatch()
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const isAudioPlaying = useSelector(selectIsPlaying)
    const speakers = useSelector(selectSpeakers)
    const {startSegmentID, endSegmentID} = useSelector(selectStartEndSegmentIDs)

    useEffect(() => {
        if (!isAudioPlaying && isPlaying)
            setIsPlaying(false)
    }, [isAudioPlaying])
    
    const handleSpeakerChange = () => {
        // FIXME: refresh regions
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
                {time2FormatedString(data.start)} – {time2FormatedString(data.end)}
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
