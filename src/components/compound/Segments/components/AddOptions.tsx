import { FC } from  "react";

// components
import Button from "../../../basic/Button/Button";
import VerticalAlignBottomRoundedIcon from '@mui/icons-material/VerticalAlignBottomRounded';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
// import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

// redux
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import { selectSegmentById, updateSegment } from "../../../../redux/slices/segmentSlice";
import { useAppDispatch } from "../../../../redux/hooks";

// styles
import styled from "styled-components";

// types
import Layer from "../../../../style/Layer";
import { EntityId } from "@reduxjs/toolkit";


interface AddOptionsProps extends Layer {
    idx: EntityId
}

const AddOptionsLayout = styled.div<Layer>`
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
    padding: 0 32px;
    border-bottom: 1px solid ${({theme, layer}) => theme.layers[layer].active};
    height: 100%;
    width: 100%;
`

const AddOptions: FC<AddOptionsProps & React.HTMLAttributes<HTMLDivElement>> = ({layer, idx, ...props}) => {
    const dispatch = useAppDispatch()
    const { id: currentId, segment } = useSelector((state: RootState) => selectSegmentById(state, idx))
    const { id: prevSegmentId, segment: prevSegment } = useSelector((state: RootState) => selectSegmentById(state, idx, -1))
    const { id: nextSegmentId, segment: nextSegment } = useSelector((state: RootState) => selectSegmentById(state, idx, 1))
    const { id: _, segment: nextnextSegment } = useSelector((state: RootState) => selectSegmentById(state, idx, 2))
    
    const shouldShow = (buttonType: string) => {
        let ans = false
        const neighSegment = (buttonType === "merge_up") ? prevSegment : (buttonType === "merge_down") ? nextSegment : null
        
        if (neighSegment === undefined || neighSegment === null) {
            ans = false
        }
        else if (neighSegment.group_tags.length === 0) {
            ans = false
        }
        else if (neighSegment.group_tags[0] === "!END_group" || neighSegment.group_tags[0] === "!START_group") {
            ans = true
        }

        return ans
    }

    const handleAppendAbove = () => {
        if (segment === undefined || segment === null) return
        if (prevSegment === undefined || prevSegment === null) return

        dispatch(updateSegment({id: currentId, changes: {group_tags: ["!END_group"]}}))
        
        if (prevSegment.group_tags[0] === "!END_group") {
            dispatch(updateSegment({id: prevSegmentId, changes: {group_tags: ["!IN_group"]}}))
        }
    }
    
    const handleAppendBelow = () => {
        if (segment === undefined || segment === null) return
        if (nextSegment === undefined || nextSegment === null) return
        if (nextnextSegment === undefined || nextnextSegment === null) return
        
        dispatch(updateSegment({id: currentId, changes: {group_tags: [...nextSegment.group_tags]}}))
        
        if (nextnextSegment.group_tags.length > 0) { // nextnextSegment is either !IN_group or !END_group
            dispatch(updateSegment({id: nextSegmentId, changes: {group_tags: ["!IN_group"]}}))
        } else {
            dispatch(updateSegment({id: nextSegmentId, changes: {group_tags: ["!END_group"]}}))
        }
    }
    
    const handleCreateGroup = () => {
        if (segment === undefined || segment === null) return
        dispatch(updateSegment({id: currentId, changes: {group_tags: ["!START_group"]}}))
    }

    return (
        <AddOptionsLayout layer={layer} {...props}>
            <Button variant="icon" style={shouldShow("merge_up") ? {} : {opacity: 0, pointerEvents: "none"}} layer={layer} onClick={handleAppendAbove}>
                <VerticalAlignTopRoundedIcon />
            </Button>
            <Button variant="icon" layer={layer} onClick={handleCreateGroup}>
                <AddBoxOutlinedIcon />
            </Button>
            <Button variant="icon" style={shouldShow("merge_down") ? {} : {opacity: 0, pointerEvents: "none"}} layer={layer} onClick={handleAppendBelow}>
                <VerticalAlignBottomRoundedIcon />
            </Button>
        </AddOptionsLayout>
    )
}

export default AddOptions
