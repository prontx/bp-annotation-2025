import Controls from "./components/compound/Controls/Controls"
import Waveform from "./components/compound/Waveform/Waveform"
import MenuBar from "./components/compound/MenuBar/MenuBar"

function App() {
    return <>
        <MenuBar />
        <div style={{margin: "0 16px"}}>
            <Waveform />
            <Controls />
        </div>
    </>
}

export default App
