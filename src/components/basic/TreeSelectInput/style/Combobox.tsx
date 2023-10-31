import { Combobox as BaseCombobox } from "@reach/combobox";
import styled from "styled-components";
import Layer from "../../../../style/Layer";

const Combobox = styled(BaseCombobox)<Layer>`
    display: flex;
    align-items: center;
    cursor: text;
    border-radius: 4px;
    padding: 2px 2px 2px 8px;
    background: ${({theme, layer}) => theme.layers[layer].background};
    border: 2px solid ${({theme, layer}) => theme.layers[layer].background};
    color: ${({theme}) => theme.textSecondary}; 

    &:hover {
        border: 2px solid ${({theme, layer}) => theme.layers[layer].hover};
    }

    &:active, &:focus-within {
        outline: none;
        border: 2px solid ${({theme, layer}) => theme.layers[layer].active};
        background: ${({theme, layer}) => theme.layers[layer].active};

        [data-reach-combobox-input] {
            background: ${({theme, layer}) => theme.layers[layer].active};
        }
    }

    .stepBackBtn {
        padding: 2px;
    }
`

export default Combobox;