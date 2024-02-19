import { FC } from "react"

// components
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

// types
import Layer from "../../../style/Layer"

// styles
import styled from "styled-components"


interface TagProps extends Layer {
    deleteCallback: (tag: string) => void,
    tag: string
}

const StyledTag = styled.div<Layer>`
    display: inline-flex;
    background: ${({theme, layer}) => theme.layers[layer].background};
    border-radius: 1rem;
    padding: 0 8px;
    height: 24px;
    align-items: center;
    position: relative;

    & > .text {
        transform: translateY(-2px);
    }

    & > .deleteIcon {
        display: none;
        height: 20px;
        cursor: pointer;
        border-radius: 10px;
        margin-left: 2px;
        padding: 2px;
        color: ${({theme}) => theme.textSecondary};
    }

    &:hover {
        /* padding: 0 3px 0 8px; */

        .deleteIcon {
            display: block;
        }
    }

    .deleteIcon {
        position: absolute;
        right: 4px;
        height: 18px;
        width: 18px;
        background: ${({theme, layer}) => theme.layers[layer+1].background};

        &:hover {
            color: ${({theme}) => theme.textPrimary};
            background: ${({theme, layer}) => theme.layers[layer].hover};
        }

        &:active {
            background: ${({theme, layer}) => theme.layers[layer].active};
        }
        
        svg {
            width: 16px;
            height: 16px;
            transform: translate(-1px, -3px)
        }
    }
`

const Tag: FC<TagProps & React.HTMLAttributes<HTMLDivElement>> = ({layer, deleteCallback, tag, ...props}) => {
    return (
        <StyledTag layer={layer} {...props}>
            <span className="text">{tag}</span>
            <span className="deleteIcon" onClick={() => deleteCallback(tag)}><ClearRoundedIcon /></span>
        </StyledTag>
    )
}

export default Tag
