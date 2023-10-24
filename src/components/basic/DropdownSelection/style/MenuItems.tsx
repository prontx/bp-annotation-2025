import { clickableBaseStyles } from "../../../../style/clickableBaseStyles";
import styled from "styled-components";
import Layer from "../../../../style/Layer";

import { MenuItems as BaseMenuItems } from "@reach/menu-button";

export const MenuItems = styled(BaseMenuItems)<Layer>`
    background-color: transparent;
    border: none;
    padding: 4px;
    
    [data-reach-menu-item] {
        ${clickableBaseStyles}

        background-color: ${({theme, layer}) => theme.layers[layer].background};
        color: ${({theme}) => theme.textSecondary};
        padding: 4px 8px;
        font-size: 1rem;
        
        &[data-selected] {
            background-color: ${({theme, layer}) => theme.layers[layer].active};
            color: ${({theme}) => theme.textPrimary};
        }
    }
`