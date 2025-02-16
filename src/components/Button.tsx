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
    background: #363636;
    // color: ${theme.textSecondary};
    color: white;
    font-size: ${theme.text_s};
    text-transform: uppercase;
    font-weight: bold;
    font-family: Helvetica;
    border-radius: 10px;   
    
    & svg {
        fill: ${theme.textSecondary};
    }

    &:hover, &:focus {
        // background: ${theme.layers[$layer][$color].hover};
        // background: #35C073;
        // color: ${theme.textPrimary};
        color: #35C073;
        transform: scale(1.10); /* Slightly enlarges the text */
        transition: transform 0.2s ease-in-out;

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

    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }


    .change & {
        background: #247BA0; /* Change background when inside .change */
    }

    .delete & {
        background: #FB3640;
    }
`}`

const Button: FC<ButtonProps> = ({icon, ...props}) => {
    return (
        <StyledButton {...props} onKeyDown={e => e.preventDefault()}>
            {icon}
            {props.children}
        </StyledButton>
    )
}

export default Button
