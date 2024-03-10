import styled from "styled-components";
import Layer from "../../../types/Layer";

const WaveformContainer = styled.div<Layer>`
    padding: 8px 8px 0 8px;
    background: ${({theme, layer}) => theme.layers[layer].background};
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    
    #waveform {
        padding: 0 4px;
        background: ${({theme, layer}) => theme.layers[layer+1].background};
        border-radius: 4px;
        height: 96px;
    }
`

export default WaveformContainer
