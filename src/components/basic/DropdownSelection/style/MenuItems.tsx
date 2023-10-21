import { clickableBaseStyles } from "../../../../style/clickableBaseStyles";
import styled from "styled-components";

import { MenuItems as BaseMenuItems } from "@reach/menu-button";

export const MenuItems = styled(BaseMenuItems)`
    background-color: transparent;
    border: none;
    padding: 4px;
    
    [data-reach-menu-item] {
        ${clickableBaseStyles}

        background-color: ${({theme}) => theme.gray80};
        color: ${({theme}) => theme.textSecondary};
        padding: 4px 8px;
        font-size: 1rem;
        
        &[data-selected] {
            background-color: ${({theme}) => theme.gray80Hover};
            color: ${({theme}) => theme.textPrimary};
        }
    }
`