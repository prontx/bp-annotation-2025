import { FC } from "react";

import { clickableBaseStyles } from "../../../style/clickableBaseStyles";
import styled from "styled-components";
import Layer from "../../../types/Layer"

import { useMenuButtonContext } from "@reach/menu-button";
import { MenuButton as BaseMenuButton, MenuButtonProps } from "@reach/menu-button";


const StyledMenuButton = styled(BaseMenuButton)<Layer>`
    ${clickableBaseStyles}

    display: flex;
    background-color: ${({theme, $layer}) => theme.layers[$layer].background};
    color: ${({theme}) => theme.textSecondary};
    padding: 4px 8px;
    font-size: 1rem;

    &:hover, &:focus, &.expanded {
        background-color: ${({theme, $layer}) => theme.layers[$layer].hover};
        color: ${({theme}) => theme.textPrimary};
    }

    &:active {
        background-color: ${({theme, $layer}) => theme.layers[$layer].active};
        color: ${({theme}) => theme.textPrimary};
    }
    
    .dropdownArrow {
        margin-left: 8px;
    }
`

export const MenuButton : FC<MenuButtonProps & Layer & {className?: string}> = ({...props}) => {
    const { isExpanded } = useMenuButtonContext()

    if (isExpanded){
        props.className = `${props.className} expanded`
    }

    return (
        <StyledMenuButton className={props.className} {...props} />
    )
}
