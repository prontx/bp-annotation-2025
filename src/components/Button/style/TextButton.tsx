import styled from "styled-components";
import { clickableBaseStyles } from "../../../style/clickableBaseStyles";
import Layer from "../../../types/Layer";

export const TextButton = styled.button<Layer>`
    ${clickableBaseStyles}
    
    background-color: ${({theme, layer}) => theme.layers[layer].background};
    color: ${({theme}) => theme.textSecondary};
    padding: 4px 8px;
    font-size: 1rem;

    &:hover, &:focus {
        background-color: ${({theme, layer}) => theme.layers[layer].hover};
        color: ${({theme}) => theme.textPrimary};
    }

    &:active {
        background-color: ${({theme, layer}) => theme.layers[layer].active};
        color: ${({theme}) => theme.textP};
    }
`