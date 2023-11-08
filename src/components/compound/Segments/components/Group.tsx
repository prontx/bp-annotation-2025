import { FC } from "react";

// components
import Tag from "../../../basic/Tag/Tag";
import TreeSelectInput from "../../../basic/TreeSelectInput/TreeSelectInput";

// types
import Layer from "../../../../style/Layer";
import { EntityId } from "@reduxjs/toolkit";
import { RootState } from "../../../../redux/store";
import { Segment } from "../types/Segment";

// redux
import { useSelector } from "react-redux";
import { selectSegmentById, updateSegment } from "../../../../redux/slices/segmentSlice";
import { useAppDispatch } from "../../../../redux/hooks";

// styles
import styled from "styled-components";


interface GroupProps extends Layer {
    span: number
}

const GroupLayout = styled.div<GroupProps>`
    grid-row: span ${({span}) => span};
    background: ${({theme, layer}) => theme.layers[layer].background};
    height: calc(100% - 8px);
    border-bottom: 1px solid ${({theme, layer}) => theme.layers[layer].active};
    display: flex;
    flex-direction: column;
    margin: 4px;
    border-radius: 4px;
    border: 2px solid ${({theme, layer}) => theme.layers[layer].background};
    position: relative;

    &::after {
        content: "";
        position: absolute;
        bottom: -5px;
        left: -5px;
        width: calc(100% + 10px);
        border-bottom: 1px solid ${({theme, layer}) => theme.layers[layer].active};
    }
    
    &:hover, &:focus-within {
        border: 2px solid ${({theme, layer}) => theme.layers[layer].active};

        > .treeSelection {
            background: ${({theme, layer}) => theme.layers[layer].hover};

            [data-reach-combobox-input] {
                background: ${({theme, layer}) => theme.layers[layer].hover};
            }
        }
    }
`

const TagBlock = styled.div<Layer>`
    padding: 4px;
    height: 100%;

    & > span:not(:last-of-type) {
        margin-right: 8px;
        margin-bottom: 8px;
        /* TODO: fix aby sa to nerozbilo, keď je moc tagov */
    }
`


const Group: FC<GroupProps & {idx: EntityId} & React.HTMLAttributes<HTMLDivElement>> = ({layer, idx, span, ...props}) => {
    const dispatch = useAppDispatch()
    const { id: _, segment } = useSelector((state: RootState) => selectSegmentById(state, idx))
    if (segment === undefined || segment === null) return null
    const tags = segment.group_tags.filter(tag => tag[0] !== "!")
    
    /**
     * Dispatch event to update a segment with segmentId - add tagValue into segment.group_tags 
     */
    const handleAddTag = (tagValue: string) => {
        const newSegment: Segment = {...segment, group_tags: [...segment.group_tags, tagValue]}
        dispatch(updateSegment({ id: newSegment.id, changes: newSegment }));
    }

    return (
        <GroupLayout layer={layer} span={span} {...props}>
            <TagBlock layer={layer}>
                {tags.map((tag, idx) => <Tag key={idx} layer={layer+1}>{tag}</Tag>)}
            </TagBlock>
            <TreeSelectInput className="treeSelection" callback={handleAddTag} layer={layer} />
        </GroupLayout>
    )
}

export default Group
