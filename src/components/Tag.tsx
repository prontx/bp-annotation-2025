import { FC } from "react"

// components
import ClearRoundedIcon from "@mui/icons-material/ClearRounded"

// style
import styled, { css } from "styled-components"
import { clickableBaseStyles } from "../style/clickableBaseStyles"

// types
import Layer from "../types/Layer"


interface TagProps extends Layer, React.HTMLAttributes<HTMLSpanElement> {
    tags: string[]|undefined,
    deleteCallback?: () => void,
}

const StyledTag = styled.span<Layer>` ${({theme, $layer}) => css`
    display: inline;
    margin: 0 auto 0 2px;
    padding: 0 4px;
    background: ${theme.layers[$layer].background};
    border-radius: 4px;
    box-shadow: 0 0 0 2px ${theme.layers[$layer].background};
`}`

const DeleteIcon = styled(ClearRoundedIcon)<Layer>` ${({theme, $layer}) => css`
    ${clickableBaseStyles}
    display: inline-block;
    height: calc(1rem + 2px) !important;
    width: calc(1rem + 2px) !important;
    padding: 1px;
    margin-bottom: -4px;
    position: relative;
    background: ${theme.layers[$layer].background};

    &:hover {
        color: ${theme.textPrimary};
        background: ${theme.layers[$layer].hover};
    }

    &:active {
        background: ${theme.layers[$layer].active};
    }
`}`

const Tag: FC<TagProps> = ({$layer, tags, deleteCallback, ...props}) => {
    if (!tags || tags.length == 0)
        return null

    return (
        <StyledTag $layer={$layer} style={tags.length === 1 ? {whiteSpace: "nowrap"} : {}} {...props}>
            <span style={{marginRight: "8px", whiteSpace: "normal"}}>{(tags.length > 0) && tags[0]}</span>
            {(deleteCallback && tags.length == 1) && <DeleteIcon $layer={$layer+1} onClick={deleteCallback} />}
            <Tag tags={tags.filter((_, i) => i !== 0)} $layer={$layer+1} deleteCallback={deleteCallback} />
        </StyledTag>
    )
}

export default Tag
