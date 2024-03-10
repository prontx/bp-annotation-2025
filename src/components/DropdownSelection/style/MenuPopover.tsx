import styled from "styled-components";
import Layer from "../../../types/Layer";

import { MenuPopover as BaseMenuPopover } from "@reach/menu-button";

export const MenuPopover = styled(BaseMenuPopover)<Layer>`
    background-color: ${({theme, layer}) => theme.layers[layer].background};
    border-radius: 4px;
    border: 1px solid ${({theme, layer}) => theme.layers[layer].active};
    box-shadow: 0 0 4px 0 ${({theme}) => theme.gray100};
    
    [data-reach-menu-items]:not(:last-of-type) {
        border-bottom: 1px solid ${({theme, layer}) => theme.layers[layer].active};
    }
`