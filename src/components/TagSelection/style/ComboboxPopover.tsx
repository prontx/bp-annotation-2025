import { ComboboxPopover as BaseComboboxPopover } from "@reach/combobox";
import styled from "styled-components";
import Layer from "../../../types/Layer";
import { scrollableBaseStyles } from "../../../style/scrollableBaseStyles";


export const ComboboxPopover = styled(BaseComboboxPopover)<Layer>`
    ${scrollableBaseStyles}
    background-color: ${({theme, $layer}) => theme.layers[$layer].background};
    border-radius: 4px;
    border: 1px solid ${({theme, $layer}) => theme.layers[$layer].active};
    box-shadow: 0 0 4px 0 ${({theme}) => theme.gray100};
    padding: 4px;
    bottom: 8px;
`
