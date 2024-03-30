import { FC, ReactNode } from "react"

// style
import styled from "styled-components";
import { clickableBaseStyles } from "../../style/clickableBaseStyles";

// types
import Layer from "../../types/Layer";


interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, Layer {
    blended?: boolean,
    icon?: ReactNode,
    color?: "neutral"|"danger",
    disabled?: boolean,
    size?: "s"|"m"|"l",
}

const StyledButton = styled.button<{$layer: number, $color?: "neutral"|"danger", $blended?: boolean, $size?: "s"|"m"|"l"}>`
    ${clickableBaseStyles}
    
    display: flex;
    align-items: center;
    gap: 2px;
    padding: ${({$size}) => ($size == "s") ? "2px 8px" : ($size === "l") ? "10px 16px" : "4px 8px"};
    background: ${({theme, $layer, $color, $blended}) => {
        if ($color === "danger" && !$blended){
            return theme.layers[$layer].danger
        }
        return theme.layers[$layer].background
    }};

    color: ${({theme}) => theme.textSecondary};
    font-size: ${({theme}) => theme.text_s};
    text-transform: uppercase;
    font-weight: bold;

    & svg {
        fill: ${({theme}) => theme.textSecondary};
    }

    &:hover, &:focus {
        background: ${({theme, $layer, $color}) => $color === "danger" ? theme.layers[$layer].dangerHover : theme.layers[$layer].hover};
        color: ${({theme}) => theme.textPrimary};

        svg {
            fill: ${({theme}) => theme.textPrimary};
        }
    }

    &:active {
        background: ${({theme, $layer, $color}) => $color === "danger" ? theme.layers[$layer].dangerActive : theme.layers[$layer].active};
        color: ${({theme}) => theme.textP};

        svg {
            fill: ${({theme}) => theme.textPrimary};
        }
    }
` 

const Button: FC<ButtonProps> = ({blended, size, icon, color, disabled, layer, ...props}) => {
    return (
        <StyledButton $layer={layer} $size={size} $color={color} $blended={blended} {...props}>
            {icon}
            {props.children}
        </StyledButton>
    )
}

export default Button
