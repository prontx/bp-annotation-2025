import Controls from "./components/compound/Controls/Controls"
import Waveform from "./components/compound/Waveform/Waveform"
import MenuBar from "./components/compound/MenuBar/MenuBar"

function App() {
    return <>
        <MenuBar layer={0} />
        <div style={{margin: "0 16px"}}>
            <Waveform layer={1}/>
            <Controls layer={1}/>
        </div>
    </>
}

export default App
