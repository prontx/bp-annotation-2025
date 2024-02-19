import { FC, forwardRef } from "react";

// types
import Layer from "../../../../style/Layer";

// styles
import styled from "styled-components";
import Tag from "../../../basic/Tag/Tag";
import TreeSelectInput from "../../../basic/TreeSelectInput/TreeSelectInput";


interface TagAreaProps extends Layer {
    span: number,
    tags: string[],
    placeholder: string,
    onTagDelete: (tag: string) => void,
    onTagAdd: (tag: string) => void
}

const StyledTagArea = styled.div<Layer & {span: number}>`
    /* grid-row: span ${({span}) => span}; */
    background: ${({theme, layer}) => theme.layers[layer].background};
    height: calc(100% - 8px);
    max-height: calc(100% - 8px);
    display: flex;
    flex: 1;
    flex-direction: column;
    border-radius: 4px;
    border: 2px solid ${({theme, layer}) => theme.layers[layer].background};
    
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

    & > div:not(:last-of-type) {
        margin-right: 8px;
        margin-bottom: 8px;
        /* TODO: fix aby sa to nerozbilo, keď je moc tagov */
    }
`

const TagArea: FC<TagAreaProps> = ({layer, span, placeholder, onTagDelete, onTagAdd, tags, ...props}) => {
    return (
        <StyledTagArea layer={layer} span={span} {...props}>
            <TagBlock layer={layer}>
                {tags.map((tag, idx) => <Tag key={idx} layer={layer+1} deleteCallback={onTagDelete} tag={tag} />)}
            </TagBlock>
            <TreeSelectInput className="treeSelection" placeholder={placeholder} callback={onTagAdd} layer={layer} />
        </StyledTagArea>
    )
}

export default TagArea