import { useRef } from "react"

// components
import Controls from "./features/player/components/Controls"
import Waveform from "./features/player/components/Waveform"
import MenuBar from "./features/workspace/components/MenuBar"
// import SegmentList from "./features/transcript/components/SegmentList"
import SegmentListOptimized from "./features/transcript/components/SegmentListOptimized"
import GroupList from "./features/grouping/components/GroupList"
import SpeakerList from "./features/transcript/components/SpeakerList"
import SpecialChars from "./features/transcript/components/SpecialChars"

// wavesurfer
import RegionsPlugin from "wavesurfer.js/plugins/regions"

// style
import styled, { createGlobalStyle } from "styled-components"
import { scrollableBaseStyles } from "./style/scrollableBaseStyles"

// hooks
import { useFetchJob } from "./features/workspace/hooks/useFetchJob"
import { useFetchTranscript } from "./features/transcript/hooks/useFetchTranscript"
import { useHistory } from "./features/workspace/hooks/useHistory"
import { useSave } from "./features/workspace/hooks/useSave"
import { useLoadGroups } from "./features/grouping/hooks/useLoadGroups"
import { useHotkeys } from "./features/workspace/hooks/useHotkeys"

//notifications
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const BaseStyle = createGlobalStyle`
    body {
        font-family: Inter, system-ui, Helvetica, Arial, sans-serif;
        line-height: 1.5;
        font-size: ${({theme}) => theme.text_m};

        color: ${({theme}) => theme.textSecondary};
        // background: ${({theme}) => theme.gray100};
        background: #363636;
    }
    /* Chrome */
    ::-webkit-scrollbar {
      width: 8px;  
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
      border: 2px solid transparent;
      background-clip: content-box;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #666;
    }
`

const AppLayout = styled.div`
    width: 100vw;
    height: 100vh;
    display: grid;
    gap: 8px;
    padding: 8px 8px 0 8px;
    overflow: hidden;
    grid-template-columns: 1fr 3fr 1fr;
    grid-template-rows: repeat(3, auto) 1fr;

    .menuBar, .waveform {
        grid-column: 1 / -1;
    }
    
    & .controls {
        grid-column: 1 / -1;
        margin: -8px 0 4px 0;
    }
    .waveform {
        background: #1F1F1F;
    }
`

const SideBar = styled.aside`
    ${scrollableBaseStyles}
    display: flex;
    flex-direction: column;
    gap: 38px;
`

function App() {
    useFetchJob()
    useFetchTranscript()
    useLoadGroups()
    const waveformRegionsRef = useRef<RegionsPlugin>(RegionsPlugin.create())
    useHistory(waveformRegionsRef)
    useSave()
    useHotkeys()

    return (<>
        <BaseStyle />
        <AppLayout>
            <MenuBar className="menuBar" $layer={0}/>
            <Waveform waveformRegionsRef={waveformRegionsRef} className="waveform" $layer={1}/>
            <Controls className="controls" $layer={1}/>
            <SideBar>
                <SpeakerList waveformRegionsRef={waveformRegionsRef} $layer={1} />
                <SpecialChars $layer={1} />
            </SideBar>
            <SegmentListOptimized className="segments" waveformRegionsRef={waveformRegionsRef} $layer={1}/>
            <GroupList className="groups" $layer={1}>
            </GroupList>
            <ToastContainer />
        </AppLayout>
    </>)
}

export default App
