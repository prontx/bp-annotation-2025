import Controls from "./components/compound/Controls/Controls"
import Waveform from "./components/compound/Waveform/Waveform"
import MenuBar from "./components/compound/MenuBar/MenuBar"
import SegmentList from "./components/compound/Segments/SegmentList"

import styled from "styled-components";
import Layer from "./style/Layer";

const AppLayout = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    overflow: hidden;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: repeat(3, auto) 1fr;

    & .menuBar {
        grid-column: 1 / -1;
    }
    
    & .waveform {
        grid-column: 1 / -1;
        margin: 0 8px;
    }
    
    & .controls {
        grid-column: 1 / -1;
        margin: 0 8px 16px 8px;
    }

    & .sideBar {
        margin: 0 4px 0 8px;
    }

    & .segments {
        margin: 0 8px 0 4px;
    }
`

const ScrollBox = styled.div<Layer>`
    /* background: ${({theme, layer}) => theme.layers[layer].background}; */
    border-radius: 8px 8px 0 0;
    min-height: 100%;
    overflow: hidden;
    overflow-y: scroll;
    scrollbar-width: none;
    position: relative;
    padding-right: 8px;
    box-shadow: inset 0 12px 8px -8px rgba(0,0,0,0.2);
    /* background: ${({theme, layer}) => theme.layers[layer].background}; */

    &::after {
        content: "";
        display: block;
        background: ${({theme, layer}) => theme.layers[layer].background};
        width: 4px;
        height: 24%;
        border-radius: 2px;
        position: absolute;
        top: 4px;
        right: 0;
    }
`

function App() {
    return <AppLayout>
        <MenuBar className="menuBar" layer={0}/>
        <Waveform className="waveform" layer={1}/>
        <Controls className="controls" layer={1}/>
        <ScrollBox className="sideBar" layer={1}>
            
        </ScrollBox>
        <ScrollBox className="segments" layer={2}>
            <SegmentList layer={2}/>
        </ScrollBox>
    </AppLayout>
}

export default App
