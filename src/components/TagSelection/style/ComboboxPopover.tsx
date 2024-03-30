import { ComboboxPopover as BaseComboboxPopover } from "@reach/combobox";
import styled from "styled-components";
import Layer from "../../../types/Layer";


export const ComboboxPopover = styled(BaseComboboxPopover)<Layer>`
    background-color: ${({theme, $layer}) => theme.layers[$layer].background};
    border-radius: 4px;
    border: 1px solid ${({theme, $layer}) => theme.layers[$layer].active};
    box-shadow: 0 0 4px 0 ${({theme}) => theme.gray100};
    padding: 4px;
    bottom: 8px;
    overflow-y: scroll;
    scrollbar-width: thin;
`
