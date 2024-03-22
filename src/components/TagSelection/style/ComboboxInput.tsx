import { ComboboxInput as BaseComboboxInput } from "@reach/combobox";
import styled from "styled-components";
import { editableBaseStyles } from "../../../style/editableBaseStyles";
import Layer from "../../../types/Layer";


export const ComboboxInput = styled(BaseComboboxInput)<Layer>`
    ${editableBaseStyles}
    background: ${({theme, layer}) => theme.layers[layer].background};
    color: ${({theme}) => theme.textSecondary};
    width: 100%;
    padding: 4px 8px;
    font-size: 1rem;
    border: 2px solid ${({theme, layer}) => theme.layers[layer].active};
    outline: none;
    
    &:hover {
        background: ${({theme, layer}) => theme.layers[layer].hover};
    }
    
    &:active, &:focus {
        background: ${({theme, layer}) => theme.layers[layer].active};
    }
`
