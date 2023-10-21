import styled from "styled-components";

import { MenuPopover as BaseMenuPopover } from "@reach/menu-button";

export const MenuPopover = styled(BaseMenuPopover)`
    background-color: ${({theme}) => theme.gray80};
    border-radius: 4px;
    border: 1px solid ${({theme}) => theme.gray70};
    box-shadow: 0 0 4px 0 ${({theme}) => theme.gray100};
    
    [data-reach-menu-items]:not(:last-of-type) {
        border-bottom: 1px solid ${({theme}) => theme.gray70};
    }
`