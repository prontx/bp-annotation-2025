import { FC } from "react"

// components
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

// types
import Layer from "../../../style/Layer"

// styles
import styled from "styled-components"


interface TagProps extends Layer, React.HTMLAttributes<HTMLDivElement> {
    deleteCallback?: (tag: string) => void,
    tagText: string,
    sub1?: string,
    sub2?: string
}

const StyledTag = styled.div`
    display: inline-flex;
    border-radius: 1rem;
    padding: 0 8px;
    height: 24px;
    align-items: center;
`

const Capsule = styled.div<Layer>`
    background: ${({theme, layer}) => theme.layers[layer].background};
    line-height: 1rem;
    display: flex;
    border-radius: 24px;
    padding: 2px 2px 2px 8px;
    align-items: center;
    gap: 4px;

    &.top {
        padding-right: 8px;
    }

    & .deleteIcon {
        display: none;
        height: 20px;
        cursor: pointer;
        border-radius: 10px;
        margin-left: 2px;
        padding: 2px;
        color: ${({theme}) => theme.textSecondary};
    }

    &:hover {
        .deleteIcon {
            display: block;
        }
    }

    .deleteIcon {
        right: 12px;
        height: 18px;
        width: 18px;
        margin-right: -6px;
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
            transform: translate(-1px, -1px)
        }
    }
`

const Tag: FC<TagProps> = ({layer, deleteCallback, tagText, ...props}) => {
    return (
        <StyledTag {...props}>
            <Capsule layer={layer} className={`text ${!props.sub1 && "top"}`}>
                {tagText}
                {props.sub1 && <Capsule layer={layer+1} className={`text ${!props.sub2 && "top"}`}>
                    {props.sub1}
                    {props.sub2 && <Capsule layer={layer+2} className="text top">
                        {props.sub2}
                        {deleteCallback && <span className="deleteIcon" onClick={() => deleteCallback(tagText)}><ClearRoundedIcon /></span>}
                    </Capsule>}
                    {(deleteCallback && !props.sub2) && <span className="deleteIcon" onClick={() => deleteCallback(tagText)}><ClearRoundedIcon /></span>}
                </Capsule>}
                {(deleteCallback && !props.sub1) && <span className="deleteIcon" onClick={() => deleteCallback(tagText)}><ClearRoundedIcon /></span>}
            </Capsule>
        </StyledTag>
    )
}

export default Tag
