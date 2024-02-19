import { FC } from "react";

// components
import Button from "../../../basic/Button/Button";
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
// import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
// import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import OutputRoundedIcon from '@mui/icons-material/OutputRounded';
import Tooltip from "../../../basic/Tooltip/Tooltip";

// redux
import { selectGroupStart, selectSegmentById, updateSegment } from "../../../../redux/slices/segmentSlice";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../../redux/hooks";

// styles
import styled from "styled-components";

// types
import Layer from "../../../../style/Layer";
import { EntityId } from "@reduxjs/toolkit";
import { RootState } from "../../../../redux/store";

interface SegmentActionsProps extends Layer {
    idx: EntityId
}

const SegmentActionsLayout = styled.div<Layer>`
    display: flex;
    position: relative;
`

const SegmentActions: FC<SegmentActionsProps & React.HTMLAttributes<HTMLDivElement>> = ({idx, layer, ...props}) => {
    const dispatch = useAppDispatch()
    const { id: currId, segment: currSegment } = useSelector((state: RootState) => selectSegmentById(state, idx))
    const { id: prevId, segment: prevSegment } = useSelector((state: RootState) => selectSegmentById(state, idx, -1))
    const { id: nextId, segment: nextSegment } = useSelector((state: RootState) => selectSegmentById(state, idx, 1))
    const { id: _, segment: startSegment } = useSelector((state: RootState) => selectGroupStart(state, idx))
    const isInGroup = (currSegment && currSegment.group_tags && currSegment.group_tags.length > 0) ? true : false

    const handleMergeDown = () => {
        console.log("> handle merge down")
    }

    const handleSegmentDelete = () => {
        console.log("> handle segment delete")
    }

    const handleGroupLeave = () => {
        console.log("> handle group leave")
        if (!currSegment) return
        if (currSegment.group_tags.length === 0) return
        if (!startSegment) return

        // p c n  -> outcome
        // ? means we don't care
        // ======================
        // ? S S_ -> just remove
        // ? S IE -> move S
        // S I IE -> make next into S
        // I I IE -> make next into S and prev into E
        // S E ?  -> just remove
        // I E ?  -> move E
        switch (currSegment.group_tags[0]) {
            case "!START_group":
                if (nextSegment && nextSegment.group_tags.length > 0 && (nextSegment.group_tags[0] === "!IN_group" || nextSegment.group_tags[0] === "!END_group")){
                    dispatch(updateSegment({ id: nextId, changes: {...nextSegment, group_tags: [...currSegment.group_tags]} }))
                }
                break;
            case "!IN_group":
                dispatch(updateSegment({ id: nextId, changes: {...nextSegment, group_tags: [...startSegment.group_tags]} }))

                if (prevSegment && prevSegment.group_tags.length > 0 && prevSegment.group_tags[0] === "!IN_group"){
                    dispatch(updateSegment({ id: prevId, changes: {...prevSegment, group_tags: ["!END_group"]} }))
                }
                break;
            case "!END_group":
                if (prevSegment && prevSegment.group_tags.length > 0 && prevSegment.group_tags[0] === "!IN_group"){
                    dispatch(updateSegment({ id: prevId, changes: {...prevSegment, group_tags: ["!END_group"]} }))
                }
                break;
        
            default:
                break;
        }
        dispatch(updateSegment({ id: currId, changes: {...currSegment, group_tags: []} }))

        // ======================
        // _ S _ -> just remove
        // _ S S -> just remove
        // S S _ -> just remove
        // S S S -> just remove
        // E S _ -> just remove
        // E S S -> just remove
        // S E _ -> just remove
        // S E S -> just remove
        // _ S I -> move S
        // _ S E -> move S
        // S S I -> move S
        // S S E -> move S
        // E S I -> move S
        // E S E -> move S
        // S I I -> make next into S 
        // S I E -> make next into S
        // I E _ -> move E
        // I E S -> move E
        // I I I -> make next into S and prev into E
        // I I E -> make next into S and prev into E
        // ======================
        // _ _ _ 
        // _ _ S 
        // _ _ I 
        // _ _ E 
        // _ I _ 
        // _ I S 
        // _ I I 
        // _ I E 
        // _ E _ 
        // _ E S 
        // _ E I 
        // _ E E 
        // S _ _
        // S _ S
        // S _ I
        // S _ E
        // S I _
        // S I S
        // S E I
        // S E E
        // I _ _
        // I _ S
        // I _ I
        // I _ E
        // I S _
        // I S S
        // I S I
        // I S E
        // I I _
        // I I S
        // I E I
        // I E E
        // E _ _
        // E _ S
        // E _ I
        // E _ E
        // E I _
        // E I S
        // E I I
        // E I E
        // E E _
        // E E S
        // E E I
        // E E E
    }

    return (
        <SegmentActionsLayout layer={layer} {...props}>
            <Tooltip label="Delete segment" layer={layer+1}>
                <Button variant="icon" layer={layer} onClick={handleSegmentDelete}>
                    <DeleteOutlineRoundedIcon />
                </Button>
            </Tooltip>
            <Tooltip label="Merge down" layer={layer+1}>
                <Button variant="icon" layer={layer} onClick={handleMergeDown}>
                    <KeyboardDoubleArrowDownRoundedIcon />
                </Button>
            </Tooltip>
            <Tooltip label="Detach from group" layer={layer+1}>
                <Button variant="icon" layer={layer} onClick={handleGroupLeave} style={isInGroup ? {} : {opacity: 0, pointerEvents: "none"}}>
                    <OutputRoundedIcon />
                </Button>
            </Tooltip>
        </SegmentActionsLayout>
    )
}

export default SegmentActions