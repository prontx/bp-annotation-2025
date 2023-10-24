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
`

export const MenuButton : FC<MenuButtonProps & Layer> = ({...props}) => {
    const { isExpanded } = useMenuButtonContext()

    return (
        <StyledMenuButton isExpanded={isExpanded} {...props} />
    )
}