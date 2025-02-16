import { FC, HTMLAttributes } from "react"

// components
import CloseIcon from "@mui/icons-material/Close"

// style
import styled, { css } from "styled-components"

// types
import Layer from "../types/Layer"
import { clickableBaseStyles } from "../style/clickableBaseStyles"


interface NamedContainerProps extends HTMLAttributes<HTMLElement>, Layer {
    name: string,
    closeCallback?: () => void,
}

const StyledNamedContainer = styled.section<Layer>` ${({theme, $layer}) => css`
    background: ${theme.layers[$layer].background};
    position: relative;
    border-radius: 4px;
    // border: 1px solid white;
    border-radius: 10px 10px 10px 10px;

    header {
        display: flex;
        align-items: center;
        padding-left: 8px;
        background: ${theme.layers[$layer+1].background};
        background: #1F1F1F;
        border-radius: 10px 10px 1px 1px;

        h2 {
            // color: ${theme.textSecondary};
            color: white;
            font-size: 0.9rem;
            // font-size: ${theme.text_xs};
        }

        svg {
            ${clickableBaseStyles}
            width: 24px;
            height: 24px;
            padding: 2px;
            margin: 2px 2px 2px auto;

            &:hover {
                fill: ${theme.textPrimary};
                background: ${theme.layers[$layer+1].hover};
            }

            &:focus, &:active {
                fill: ${theme.textPrimary};
                background: ${theme.layers[$layer+1].active};
            }
        }
    }

    .body {
        padding: 8px;
    }
`}`

const NamedContainer: FC<NamedContainerProps> = ({name, closeCallback, ...props}) => {
    return (
        <StyledNamedContainer {...props}>
            <header>
                <h2>{name}</h2>
                {closeCallback && <CloseIcon onClick={closeCallback} role="button" />}
            </header>
            {props.children}
        </StyledNamedContainer>
    )
}

export default NamedContainer
