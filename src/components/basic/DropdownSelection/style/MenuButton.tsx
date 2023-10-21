import { FC } from "react";

import { clickableBaseStyles } from "../../../../style/clickableBaseStyles";
import styled from "styled-components";

import { useMenuButtonContext } from "@reach/menu-button";
import { MenuButton as BaseMenuButton, MenuButtonProps } from "@reach/menu-button";

interface CustomMenuButtonProps {
    isExpanded: boolean;
}

const MenuButton2 = styled(BaseMenuButton)<CustomMenuButtonProps>`
    ${clickableBaseStyles}

    background-color: ${({theme}) => theme.gray80};
    color: ${({theme}) => theme.textSecondary};
    padding: 4px 8px;
    font-size: 1rem;

    ${({isExpanded, theme}) => isExpanded && `
        background-color: ${theme.gray80Hover};
        color: ${theme.textPrimary};
    `}

    &:hover, &:focus {
        background-color: ${({theme}) => theme.gray80Hover};
        color: ${({theme}) => theme.textPrimary};
    }

    &:active {
        background-color: ${({theme}) => theme.gray70};
        color: ${({theme}) => theme.textPrimary};
    }

    .dropdownArrow {
        margin-left: 8px;
    }
`

export const MenuButton : FC<MenuButtonProps> = ({...props}) => {
    const { isExpanded } = useMenuButtonContext()

    return (
        <MenuButton2 isExpanded={isExpanded} {...props} />
    )
}