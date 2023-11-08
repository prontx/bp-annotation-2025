import styled from "styled-components"
import Layer from "../../../style/Layer"

const Tag = styled.span<Layer>`
    display: inline-block;
    border-radius: 1rem;
    background: ${({theme, layer}) => theme.layers[layer].background};
    padding: 2px 8px 4px 8px;

    /* TODO: hover interaction */
`

export default Tag
