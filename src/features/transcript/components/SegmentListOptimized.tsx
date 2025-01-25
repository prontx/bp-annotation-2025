import React, { FC, HTMLAttributes, useState } from "react"
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized"
// components
import SegmentOptimized from "./SegmentOptimized"
// import Segment from "./Segment"

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

import { selectJobStatus } from "../../workspace/redux/workspaceSlice";

import { ClipLoader } from 'react-spinners';


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
    // const listRef = React.useRef({});
    // Use a properly typed ref for the List component
    const listRef = React.useRef<List | null>(null);


    const jobStatus = useSelector(selectJobStatus)  

    const cellCache = React.useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            fixedHeight: false,
            minHeight: 81,
            defaultHeight: 81,
        })
      );


    if (jobError || transcriptError){
        return (
            <SegmentLayout  $layer={$layer}>
                <p>{jobError?.code || transcriptError?.code || "Error"}: {jobError?.message || transcriptError?.message || "unknown error"}</p>
            </SegmentLayout>
        )
    }

    const updateListLayout = () => {
        if(!cellCache.current || !listRef.current) {
            return;
        }

        cellCache.current.clearAll();
        listRef.current.forceUpdateGrid();
    }

     if (jobStatus === "loading") {
            return (
                <div>
                    <ClipLoader color={"#36d7b7"} loading={true} size={150} />
                </div>
            )  
    }  

    return (
        <SegmentLayout $layer={$layer} {...props} onMouseLeave={() => setHoverID("")}>
            <AutoSizer>
                {({ width, height }) => (
                  <List
                    ref={listRef}
                    width={width}
                    height={height}
                    rowHeight={cellCache.current.rowHeight}
                    deferredMeasurementCache={cellCache.current}
                    rowCount={segmentIDs.length}
                    rowRenderer={({ key, index, style, parent }) => {
                        const segmentID = segmentIDs[index];
                    
                        return (
                            <CellMeasurer
                              key={key}
                              cache={cellCache.current}
                              parent={parent}
                              columnIndex={0}
                              rowIndex={index}
                            >
                              <SegmentOptimized
                                  key={segmentID}
                                  className={`
                                      ${selecting ? "selecting" : ""}
                                      ${(selectionStartIdx >= 0 && index >= selectionStartIdx && index <= selectionEndIdx) ? "ingroup" : ""}`}
                                  onClick={selecting ? () => dispatch(chooseSegment({id: segmentID})) : undefined}
                                  onMouseOver={selecting ? () => setHoverID(segmentID) : undefined}
                                  segmentID={segmentID}
                                  $layer={$layer+1}
                                  regionsReloadCallback={() => waveformRegionsRef.current.clearRegions()}
                                  style={{
                                    ...style,
                                  }}
                                  onResize={() => {
                                    updateListLayout();
                                  }}
                              />
                            </CellMeasurer>
                        );
                    }}
                  />
                )}
            </AutoSizer>
        </SegmentLayout>
    )
}

export default SegmentList
