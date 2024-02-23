// components
import Controls from "./components/compound/Controls/Controls"
import Waveform from "./components/compound/Waveform/Waveform"
import MenuBar from "./components/compound/MenuBar/MenuBar"
import SegmentList from "./features/transcript/components/SegmentList"
import Groups from "./components/compound/Groups/Groups"

// styles
import styled from "styled-components";

// hooks
import { useFetchJob } from "./features/job/hooks/useFetchJob"
import { useFetchTranscript } from "./features/transcript/hooks/useFetchTranscript"

// types
import Layer from "./style/Layer";

// temp for testing, FIXME
import { selectSegments } from "./features/transcript/redux/transcriptSlice"
import { useSelector } from "react-redux"
import { useEffect } from "react"


const AppLayout = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    gap: 0 8px;
    overflow: hidden;
    grid-template-columns: 1fr 3fr 1fr;
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
        margin-left: 8px;
    }

    & .segments {
        margin: 0;
    }
`

const ScrollBox = styled.div<Layer>`
    background: ${({theme, layer}) => theme.layers[layer].background};
    border-radius: 8px 8px 0 0;
    min-height: 100%;
    overflow-y: scroll;
    scrollbar-width: none;
    position: relative;
`

function App() {
    useFetchJob()
    useFetchTranscript()
    
    // FIXME: remove after testing
    // const segments = useSelector(selectSegments)
    // useEffect(() => {
    //     console.log(segments)
    // }, [segments])

    return <AppLayout>
        <MenuBar className="menuBar" layer={0}/>
        <Waveform className="waveform" layer={1}/>
        <Controls className="controls" layer={1}/>
        <ScrollBox className="sideBar" layer={1}>
        </ScrollBox>
        <ScrollBox className="segments" layer={2}>
            <SegmentList layer={2}/>
        </ScrollBox>
        <Groups className="groups" layer={1}>
        </Groups>
    </AppLayout>
}

export default App
