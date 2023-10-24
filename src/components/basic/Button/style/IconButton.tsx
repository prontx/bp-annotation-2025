import styled from "styled-components";
import { clickableBaseStyles } from "../../../../style/clickableBaseStyles";
import Layer from "../../../../style/Layer";

export const IconButton = styled.button<Layer>`
    ${clickableBaseStyles}

    display: flex;
    padding: 4px 8px;

    background-color: ${({theme, layer}) => theme.layers[layer].background};

    &:hover, &:focus {
        background-color: ${({theme, layer}) => theme.layers[layer].hover};
    }

    &:active {
        background-color: ${({theme, layer}) => theme.layers[layer].active};
    }

    & svg {
        fill: ${({theme}) => theme.textSecondary};
    }

    &:active svg, &:hover svg, &:focus svg {
        fill: ${({theme}) => theme.textPrimary};
    }
`