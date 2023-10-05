import { clickableBaseStyles } from "../../../../style/clickableBaseStyles";
import styled from "styled-components";

import { MenuButton as BaseMenuButton } from "@reach/menu-button";

export const MenuButton = styled(BaseMenuButton)`
    ${clickableBaseStyles}

    background-color: ${({theme}) => theme.gray80};
    color: ${({theme}) => theme.textSecondary};
    padding: 4px 8px;
    font-size: 1rem;

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