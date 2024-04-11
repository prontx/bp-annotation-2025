import { FC, ReactNode } from "react"

// style
import styled, { css } from "styled-components";
import { clickableBaseStyles } from "../style/clickableBaseStyles";

// types
import Layer from "../types/Layer";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, Layer {
    icon?: ReactNode,
    $blended?: boolean,
    $color?: "neutral"|"primary"|"danger",
    $size?: "s"|"m"|"l",
}

const StyledButton = styled.button<Omit<ButtonProps, "icon">>`${({theme, $layer, $color = "neutral", $size = "m", $blended = false}) => css`
    ${clickableBaseStyles}
    
    display: flex;
    align-items: center;
    gap: 2px;
    padding: ${($size == "s") ? "2px 8px" : ($size === "l") ? "10px 16px" : "4px 8px"};
    background: ${theme.layers[$layer][($blended) ? "neutral": $color].background};
    color: ${theme.textSecondary};
    font-size: ${theme.text_s};
    text-transform: uppercase;
    font-weight: bold;

    & svg {
        fill: ${theme.textSecondary};
    }

    &:hover, &:focus {
        background: ${theme.layers[$layer][$color].hover};
        color: ${theme.textPrimary};

        svg {
            fill: ${theme.textPrimary};
        }
    }

    &:active {
        background: ${theme.layers[$layer][$color].active};
        color: ${theme.textP};

        svg {
            fill: ${theme.textPrimary};
        }
    }  
`}`

const Button: FC<ButtonProps> = ({icon, ...props}) => {
    return (
        <StyledButton {...props}>
            {icon}
            {props.children}
        </StyledButton>
    )
}

export default Button
