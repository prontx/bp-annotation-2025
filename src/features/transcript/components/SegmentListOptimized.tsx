import React, { FC, HTMLAttributes, useRef, useState } from "react"
import { VariableSizeList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";

// components
import Segment from "./Segment"

// styles
import styled, { css } from "styled-components"
import { scrollableBaseStyles } from "../../../style/scrollableBaseStyles"

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { selectSelecting, chooseSegment } from "../../grouping/redux/groupingSlice";
import { selectSegmentIDs, selectTranscriptError } from "../redux/transcriptSlice"
import { selectJobError } from "../../workspace/redux/workspaceSlice";

// types
import Layer from "../../../types/Layer"
import RegionsPlugin from "wavesurfer.js/plugins/regions"

// hooks
import { useSelectingStartEnd } from "../../grouping/hooks/useSelectingStartEnd";


interface SegmentLayoutProps extends HTMLAttributes<HTMLElement>, Layer {
    waveformRegionsRef: React.MutableRefObject<RegionsPlugin>
}

const SegmentLayout = styled.section<Layer>` ${({theme, $layer}) => css`
    ${scrollableBaseStyles}

    background: ${theme.layers[$layer].background};
    padding: 8px;
    border-radius: 8px 8px 0 0;
    min-width: 100%;

    
`}`

const SegmentList: FC<SegmentLayoutProps> = ({waveformRegionsRef, $layer, ...props}) => {
    const dispatch = useAppDispatch()
    const segmentIDs = useSelector(selectSegmentIDs)
    const selecting = useSelector(selectSelecting)
    const [hoverID, setHoverID] = useState<string>("")
    const [selectionStartIdx, selectionEndIdx] = useSelectingStartEnd(segmentIDs, hoverID)
    const jobError = useSelector(selectJobError)
    const transcriptError = useSelector(selectTranscriptError)
    

    if (jobError || transcriptError){
        return (
            <SegmentLayout  $layer={$layer}>
                <p>{jobError?.code || transcriptError?.code || "Error"}: {jobError?.message || transcriptError?.message || "unknown error"}</p>
            </SegmentLayout>
        )
    }

    return (
        <SegmentLayout $layer={$layer} {...props} onMouseLeave={() => setHoverID("")}>
            <AutoSizer>
                {({ width, height }) => (
                <VariableSizeList
                    width={width}
                    height={height}
                    itemCount={segmentIDs.length}
                    estimatedItemSize={81}
                    itemSize={() => {return 81;}}
                >
                {({index, style}) => {
                    const segmentID = segmentIDs[index];
                    
                    return (<Segment
                        key={segmentID}
                        className={`
                            ${selecting ? "selecting" : ""}
                            ${(selectionStartIdx >= 0 && index >= selectionStartIdx && index <= selectionEndIdx) ? "ingroup" : ""}`}
                        onClick={selecting ? () => dispatch(chooseSegment({id: segmentID})) : undefined}
                        onMouseOver={selecting ? () => setHoverID(segmentID) : undefined}
                        segmentID={segmentID}
                        $layer={$layer+1}
                        regionsReloadCallback={() => waveformRegionsRef.current.clearRegions()}
                        style={style}
                    />);
                }}
                </VariableSizeList>
                )}
            </AutoSizer>
        </SegmentLayout>
    )
}

export default SegmentList
