import React, { FC, HTMLAttributes, useState, useEffect } from "react"
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized"
// components
import SegmentOptimized from "./SegmentOptimized"
// import Segment from "./Segment"

import { usePrevious } from "../../grouping/hooks/usePrevious"

// styles
import styled, { css } from "styled-components"
import { scrollableBaseStyles } from "../../../style/scrollableBaseStyles"

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { selectSelecting, chooseSegment } from "../../grouping/redux/groupingSlice";
import { selectSegmentIDs, selectTranscriptError, selectLastCreatedSegmentID, resetLastCreatedSegmentID } from "../redux/transcriptSlice"
import { selectJobError } from "../../workspace/redux/workspaceSlice";

// types
import Layer from "../../../types/Layer"
import RegionsPlugin from "wavesurfer.js/plugins/regions"

// hooks
import { useSelectingStartEnd } from "../../grouping/hooks/useSelectingStartEnd";

import { selectJobStatus } from "../../workspace/redux/workspaceSlice";

import { ClipLoader } from 'react-spinners';

import { SegmentTag } from "../types/Tag"

import { selectSegmentTags, toggleSegmentTag, selectSegments, selectActiveSegmentId, resetActiveSegmentId } from "../redux/transcriptSlice";

interface SegmentLayoutProps extends HTMLAttributes<HTMLElement>, Layer {
    waveformRegionsRef: React.MutableRefObject<RegionsPlugin>
}


const SegmentLayout = styled.section<Layer>` ${({theme, $layer}) => css`
    ${scrollableBaseStyles}

    // background: ${theme.layers[$layer].background};
    // background: #1F1F1F;
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

    const segments = useSelector(selectSegments);
    const jobStatus = useSelector(selectJobStatus)  

    const segmentTags = useSelector(selectSegmentTags) || [];

    const cellCache = React.useRef(
        new CellMeasurerCache({
            fixedWidth: true,
            fixedHeight: false,
            minHeight: 81,
            defaultHeight: 81,
        })
      );


      const lastCreatedSegmentID = useSelector(selectLastCreatedSegmentID);
      const prevSegmentCount = usePrevious(segmentIDs.length);
      const lastCreatedIndex = segmentIDs.indexOf(lastCreatedSegmentID);
      const activeSegmentId = useSelector(selectActiveSegmentId);
  

        useEffect(() => {
            if (!lastCreatedSegmentID || !listRef.current) return;
        
            // Find index 
            const index = segments.keys.indexOf(lastCreatedSegmentID);
            console.log("Scroll target index:", index);
        
            if (index === -1) return;
        
            // Force re-measurement
            cellCache.current.clear(index, 0);
            listRef.current.recomputeGridSize({ rowIndex: index });
        
            setTimeout(() => {
                listRef.current?.scrollToRow(index);
                dispatch(resetLastCreatedSegmentID());
            }, 50); 
        }, [lastCreatedSegmentID, segments.keys, dispatch]);
      


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
                <div className="list">
                       <List
                    ref={listRef}
                    width={width}
                    height={height}
                    rowHeight={cellCache.current.rowHeight}
                    deferredMeasurementCache={cellCache.current}
                    rowCount={segmentIDs.length}
                    rowRenderer={({ key, index, style, parent }) => {
                        const segmentID = segmentIDs[index];
                        const segment = segments.entities[segmentID];
                    
                        return (
                            <CellMeasurer
                              key={key}
                              cache={cellCache.current}
                              parent={parent}
                              columnIndex={0}
                              rowIndex={index}
                            >
                              {/* <SegmentOptimized
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
                                    // paddingBottom: "8px", // <-- Add space between items
                                    paddingTop: "100px",
                                    // marginBottom: "100px",
                                    marginTop: "100px",
                                    boxSizing: 'border-box',
                                    
                                  }}
                                  onResize={() => {
                                    updateListLayout();
                                  }}
                              /> */}



{({ measure }) => (
                    <div 
                        style={{ 
                            ...style, 
                            paddingBottom: '8px',  // Add space between items
                            // boxSizing: 'border-box'
                        }}
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
                            regionsReloadCallback={() => {
                                
                                // waveformRegionsRef.current.getRegions()
                                // waveformRegionsRef.current.clearRegions()
                                waveformRegionsRef.current.getRegions().find(region => region.id === segmentID)?.remove()
                                // useLoadRegions(wavesurfer, waveformRegionsRef);
                            }}
                            // onResize={measure}  
                            // waveformRegionsRef={waveformRegionsRef} // Pass the ref as a prop
                            onResize={() => {
                                updateListLayout();
                              }}
                            style={{
                                height: '100%',  
                                width: '91%',
                            }}
                            segmentTags={segmentTags}
                        appliedTags={segment?.segment_tags || []}
                        onTagToggle={(tagID: string) => {
                            dispatch(toggleSegmentTag({
                                segmentID,
                                tagID
                            }));
                            updateListLayout();
                        }}
                        />
                    </div>
                )}




                            </CellMeasurer>
                        );
                    }}
                  />
                </div>
               
                )}
            </AutoSizer>
        </SegmentLayout>
    )
}

export default SegmentList
