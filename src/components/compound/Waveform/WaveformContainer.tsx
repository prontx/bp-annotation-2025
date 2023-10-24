import styled from "styled-components";
import Layer from "../../../style/Layer";

const WaveformContainer = styled.div<Layer>`
    padding: 8px 8px 0 8px;
    background: ${({theme, layer}) => theme.layers[layer].background};
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    
    #waveform {
        padding: 0 4px;
        background: ${({theme, layer}) => theme.layers[layer+1].background};
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        max-height: 80px;
    }
    
    #timeline {
        padding: 0 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        background: ${({theme, layer}) => theme.layers[layer+1].background};
        pointer-events: none;
        min-height: 16px;
    }
`

export default WaveformContainer
