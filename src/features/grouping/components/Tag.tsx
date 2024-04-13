import { FC } from "react"

// components
import ClearRoundedIcon from "@mui/icons-material/ClearRounded"

// style
import styled, { css } from "styled-components"
import { clickableBaseStyles } from "../../../style/clickableBaseStyles"

// types
import Layer from "../../../types/Layer"
import { GroupTag } from "../../transcript/types/Tag"


interface TagProps extends Layer, React.HTMLAttributes<HTMLSpanElement> {
    tag: GroupTag,
    deleteCallback?: (tag: string) => void,
}

const StyledTag = styled.span<Layer>` ${({theme, $layer}) => css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
    padding: 4px;
    background: ${theme.layers[$layer].background};
    border-radius: 4px;
    /* box-shadow: 0 0 0 2px ${theme.layers[$layer].background}; */
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

const Tag: FC<TagProps> = ({$layer, tag, deleteCallback, ...props}) => {
    return (
        <StyledTag $layer={$layer} style={!tag.subcategories ? {flexWrap: "nowrap", padding: "0 4px"} : undefined} {...props}>
            <span>{tag.name}</span>
            {tag.subcategories && tag.subcategories.map(subtag => 
                <Tag
                    key={subtag.name}
                    tag={subtag}
                    $layer={$layer+1}
                    deleteCallback={deleteCallback}
                />
            )}
            {(!tag.subcategories && deleteCallback) && <DeleteIcon $layer={$layer} onClick={() => deleteCallback(tag.name)} />}
        </StyledTag>
    )
}

export default Tag
