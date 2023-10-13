import Controls from "./components/compound/Controls/Controls"
import Waveform from "./components/compound/Waveform/Waveform"

import styled from "styled-components"

const MenuBarPlaceholder = styled.div`
    height: 48px;
    width: 100%;
    background: ${({theme}) => theme.gray80};
    padding: 0 16px;
`

function App() {
    return <>
        <MenuBarPlaceholder><h1>Placeholder</h1></MenuBarPlaceholder>
        <div style={{margin: "16px"}}>
            <Waveform />
            <Controls />
        </div>
    </>
}

export default App
