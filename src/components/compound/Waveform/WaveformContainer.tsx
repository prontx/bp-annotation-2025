import styled from "styled-components";

const WaveformContainer = styled.div`
    padding: 8px 8px 0 8px;
    background: ${({theme}) => theme.gray90};
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    
    #waveform {
        padding: 0 4px;
        background: ${({theme}) => theme.gray80};
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        max-height: 80px;
    }
    
    #timeline {
        padding: 0 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        background: ${({theme}) => theme.gray80};
        pointer-events: none;
    }
`

export default WaveformContainer
