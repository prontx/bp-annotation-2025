import { FC, MouseEventHandler, useEffect, useRef, useState } from "react"

// components
import Button from "../../../components/Button"
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SegmentActions from "./SegmentActions";
import SpeakerSelection from "./SpeakerSelection"
import SegmentText from "./SegmentText";
import SpermMarker from "../../grouping/components/SpermMarker";

// style
import styled, { css } from "styled-components";

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { deleteSegment, mergeSegment, selectSegmentByID, selectSegmentIDs } from "../redux/transcriptSlice";
import { playPauseSegment, selectIsPlaying, setTime } from "../../player/redux/playbackSlice";
import { selectGroupsByStartSegment, selectIsEditing, selectStartEndSegmentIDs, updateGroupSegmentReferences } from "../../grouping/redux/groupingSlice";

// types
import type Layer from "../../../types/Layer"
// import type { Segment } from "../types/Segment";
import type { RootState } from "../../../redux/store";

// utils
// @ts-ignore
import { rgba } from "@carbon/colors"
import { time2FormatedString } from "../../../utils/time2FormatedString";
import { useScrollToSegment } from "../hooks/useScrollToSegment";


interface SegmentProps extends Layer, React.HTMLAttributes<HTMLDivElement> {
    segmentID: string,
    regionsReloadCallback: () => void,
    onResize: () => void,
}

const SegmentLayout = styled.div<Layer>` ${({theme, $layer}) => css`
    display: flex;
    flex-direction: column;
    padding: 4px;
    border-radius: 10px;
    border: 1px solid #646464;
    // background: ${theme.layers[$layer].background};
    background: #1f1f1f;
    height: fit-content !important;

    max-width: 91%; 
    width: fit-content; 
    margin-left:1%;
    position: relative;
    
    overflow:visible;

    &.selecting:hover {
        cursor: pointer;
        background: ${theme.layers[$layer].hover};
        outline: 2px solid ${theme.layers[$layer]["primary"].active};
        
        * {
            pointer-events: none;
            background: none;
        }
        overflow:visible;
    }
    
    &.selected {
        outline: 2px solid ${theme.layers[$layer]["primary"].active};
        overflow:visible;
    }

    &.ingroup {
        background: ${theme.layers[$layer].hover};

        * {
            background: none;
        }
    }
`}`

const SegmentOptimized: FC<SegmentProps> = ({segmentID, $layer, regionsReloadCallback, onResize, className, ...props}) => {
    const data = useSelector((state: RootState) => selectSegmentByID(state)(segmentID))
    const dispatch = useAppDispatch()
    const [isPlaying, setIsPlaying] = useState(false)
    const isAudioPlaying = useSelector(selectIsPlaying)
    const {start: startSegmentID, end: endSegmentID} = useSelector(selectStartEndSegmentIDs)
    const memberGroupIDs = useSelector((state: RootState) => selectGroupsByStartSegment(state)(segmentID))
    const groupEditing = useSelector(selectIsEditing)
    const segmentIDs = useSelector(selectSegmentIDs)
    
    const containerRef = useRef<HTMLDivElement>(null)

    const isCursorIn = useScrollToSegment(containerRef, segmentID)

    const [segmentHeight, setSegmentHeight] = useState(200); // Default height

    useEffect(() => {
        const container = containerRef.current;
        if(!container) return;

        // const observer = new ResizeObserver(() => {
        //     onResize && onResize();
            
        // });
        const observer = new ResizeObserver(entries => {
            onResize && onResize();
            for (let entry of entries) {
                setSegmentHeight(container.offsetHeight);

            }
        });

        observer.observe(container);

        return () => {
            // setSegmentHeight(200);
            observer.disconnect();
            
        }
    }, [segmentHeight])

    useEffect(() => {
        if (!isAudioPlaying && isPlaying)
            setIsPlaying(false)
    }, [isAudioPlaying])
    
    const handlePlayPause: MouseEventHandler<HTMLButtonElement> = (e) => {
        console.log("playPause handle clicked")
        e.stopPropagation()
        setIsPlaying(!isPlaying)
        dispatch(playPauseSegment({from: data.start, to: data.end, changedBy: `segment:${segmentID}`}))
    }

    const handleSegmentClick: MouseEventHandler<HTMLDivElement> = (e) => {
        console.log("segment clicked");
        if (props.onClick)
            props.onClick(e)
        if (groupEditing)
            return
        dispatch(setTime({value: data.start, changedBy: "segment"}))
    }

    const handleDelete = () => {
        dispatch(updateGroupSegmentReferences({segmentID: segmentID, segmentKeys: segmentIDs}))
        regionsReloadCallback()
        dispatch(deleteSegment(segmentID))
    }
    
    const handleMerge = () => {
        dispatch(updateGroupSegmentReferences({segmentID: segmentID, segmentKeys: segmentIDs, isMerge: true}))
        regionsReloadCallback()
        dispatch(mergeSegment(segmentID))
    }

    if (!data)
        return null
    
    return (<>
    <SegmentLayout
     data-segment-id={segmentID}
            $layer={(!groupEditing && isCursorIn) ? $layer+1 : $layer}
            className={`
                ${className}
                ${(segmentID === startSegmentID || segmentID === endSegmentID) ? "selected" : ""}`}
            {...props}
            ref={containerRef}
            onClick={handleSegmentClick}
        >
                <div style={{display: "flex", gap: "8px", alignItems: "center", color: "white"}}>
                    <SpeakerSelection
                        $layer={(!groupEditing && isCursorIn) ? $layer +2 : $layer+1}
                        segmentID={segmentID}
                        regionReloadCallback={regionsReloadCallback}
                    />
                    {time2FormatedString(data.start)} – {time2FormatedString(data.end)}
                    <SegmentActions
                        style={{marginLeft: "auto", backgroundColor: "transparent"}}
                        $layer={(!groupEditing && isCursorIn) ? $layer+1 : $layer}
                        deleteHandler={handleDelete}
                        mergeHandler={handleMerge}
                    />
                </div>
                <div style={{display: "flex"}}>
                    <Button
                        $layer={(!groupEditing && isCursorIn) ? $layer+1 : $layer}
                        onClick={handlePlayPause}
                        icon={isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
                        style={{ backgroundColor: "#1f1f1f" }}
                    />
                    <SegmentText
                        segmentID={segmentID}
                        $layer={(!groupEditing && isCursorIn) ? $layer+1 : $layer}
                        onClick={e => e.stopPropagation()}
                    />
                </div>
                <div style={{ position: "absolute", left: "100%", top: 0, height: "100%", overflow: "visible" }}>
                    {memberGroupIDs && memberGroupIDs.map(id => <SpermMarker key={id} $layer={$layer} groupID={id}  segmentID={segmentID}/>)}
                </div>

        </SegmentLayout>
        
        </>)
}

export default SegmentOptimized
