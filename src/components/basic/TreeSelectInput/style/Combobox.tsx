import { Combobox as BaseCombobox } from "@reach/combobox";
import styled from "styled-components";
import Layer from "../../../../style/Layer";

const Combobox = styled(BaseCombobox)<Layer>`
    display: flex;
    align-items: center;
    cursor: text;
    border-radius: 2px;
    padding: 2px 2px 2px 8px;
    background: ${({theme, layer}) => theme.layers[layer].background};
    /* border: 2px solid ${({theme, layer}) => theme.layers[layer].background}; */
    color: ${({theme}) => theme.textSecondary};
    position: relative;

    &:hover {
        /* border: 2px solid ${({theme, layer}) => theme.layers[layer].hover}; */
        background: ${({theme, layer}) => theme.layers[layer].hover} !important;

        [data-reach-combobox-input] {
            background: ${({theme, layer}) => theme.layers[layer].hover} !important;
        }
    }

    &:active, &:focus-within {
        outline: none;
        /* border: 2px solid ${({theme, layer}) => theme.layers[layer].active}; */
        background: ${({theme, layer}) => theme.layers[layer].active} !important;

        [data-reach-combobox-input] {
            background: ${({theme, layer}) => theme.layers[layer].active} !important;
        }
    }

    .stepBackBtn {
        padding: 2px;
    }
`

export default Combobox;