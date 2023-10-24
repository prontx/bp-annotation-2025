import styled from "styled-components";
import { editableBaseStyles } from "../../../style/editableBaseStyles";
import Layer from "../../../style/Layer";

const SubtleInput = styled.input<Layer>`
    ${editableBaseStyles}
    font-size: 1rem;
    color: currentColor;
    padding: 2px 4px;
    display: inline;
    width: 80px;
    background: ${({theme, layer}) => theme.layers[layer-1].background};
    
    &:hover, &:focus {
        background: ${({theme, layer}) => theme.layers[layer].background};
        outline: 2px solid ${({theme, layer}) => theme.layers[layer].active};
        color: ${({theme}) => theme.textPrimary};
    }
`

export default SubtleInput;