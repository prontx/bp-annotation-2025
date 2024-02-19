import { FC } from "react";

import { clickableBaseStyles } from "../../../../style/clickableBaseStyles";
import styled from "styled-components";
import Layer from "../../../../style/Layer"

import { useMenuButtonContext } from "@reach/menu-button";
import { MenuButton as BaseMenuButton, MenuButtonProps } from "@reach/menu-button";

interface CustomMenuButtonProps extends Layer {
    isExpanded: boolean
}

const StyledMenuButton = styled(BaseMenuButton)<CustomMenuButtonProps>`
    ${clickableBaseStyles}

    background-color: ${({theme, layer}) => theme.layers[layer].background};
    color: ${({theme}) => theme.textSecondary};
    padding: 4px 8px;
    font-size: 1rem;
    
    ${({isExpanded, theme, layer}) => isExpanded && `
        background-color: ${theme.layers[layer].hover};
        color: ${theme.textPrimary};
        `}

&:hover, &:focus {
    background-color: ${({theme, layer}) => theme.layers[layer].hover};
    color: ${({theme}) => theme.textPrimary};
}

&:active {
        background-color: ${({theme, layer}) => theme.layers[layer].active};
        color: ${({theme}) => theme.textPrimary};
    }
    
    .dropdownArrow {
        margin-left: 8px;
    }
    
    &.speaker {
        display: flex;
        align-items: center;

        &::before {
            content: "";
            display: block;
            width: 1em;
            height: 1em;
            border-radius: 1em;
            background: ${({theme}) => theme.speakerColors[0]}  ;
            margin-right: 4px;
        }
    }
`

export const MenuButton : FC<MenuButtonProps & Layer & {className?: string}> = ({...props}) => {
    const { isExpanded } = useMenuButtonContext()

    return (
        <StyledMenuButton className={props.className} isExpanded={isExpanded} {...props} />
    )
}