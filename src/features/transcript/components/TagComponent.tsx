import { FC } from "react";
import styled from "styled-components";
import { SegmentTag } from "../types/Tag";

interface TagProps {
    tag: SegmentTag;
    checked: boolean;
    onToggle: () => void;
    $layer: number;
}

const TagContainer = styled.div<{ $layer: number, $color?: string }>`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 2px 8px;
    margin: 2px;
    border-radius: 10px;
    cursor: pointer;
    background: ${({ theme, $layer, $color }) => 
        $color || theme.layers[$layer].background};
    border: 1px solid ${({ theme }) => theme.textSecondary};
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
    accent-color: green;
`;

export const TagComponent: FC<TagProps> = ({ tag, checked, onToggle, $layer }) => (
    <TagContainer 
        $layer={$layer} 
        $color={tag.color}
        onClick={onToggle}
    >
        <Checkbox checked={checked} readOnly />
        <span>{tag.label}</span>
    </TagContainer>
);