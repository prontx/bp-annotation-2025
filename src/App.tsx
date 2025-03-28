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
import { delayedSave, loadJobData, saved, selectJobID, setError } from "./features/workspace/redux/workspaceSlice"
import { useSelector } from "react-redux"
import { loadGroups } from "./features/grouping/redux/groupingSlice"

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
import { socket } from "./features/connection/websocket"
import { BaseMessage, DeleteSegmentMessage, LoadJobMessage, MessageType, SaveTranscriptMessage } from "./features/connection/messages"
import { useAppDispatch } from "./redux/hooks"
import { Job } from "./features/workspace/types/Job"
import { deleteSegment, loadTranscriptData, selectGroupsRaw, selectSegments, selectTranscriptStatus } from "./features/transcript/redux/transcriptSlice"
import { TranscriptLoadingParams } from "./features/transcript/types/Transcript"
import { adaptGroups } from "./features/workspace/utils/adaptGroups"
import { save } from "./features/workspace/redux/workspaceSlice"
import { RootState } from "./redux/store"


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
    const dispatch = useAppDispatch()

    const params = new URLSearchParams(window.location.search)
    const JOB_ID = params.get('job_id')
    console.log("Using JOB_ID:" + JSON.stringify(JOB_ID))


    if(socket.isDisconnected()) {
        socket.onReady = (e) => {
            console.log("Websocket server connected")
            if (JOB_ID !== null) {
                console.log("Sending loadJob request")
                socket.send(new LoadJobMessage(JOB_ID))
                // socket.send(new SaveTranscriptMessage(JOB_ID))

                const handleManualSave = () => {
                    console.log("Manual save triggered")
                    if(JOB_ID) {
                      
                    }   
                }
                document.addEventListener('manual-save', handleManualSave)

                const handleSegmentEdit = (e: Event) => {
                    const customEvent = e as CustomEvent<{ segmentID: string; text: string }>;
                    console.log("Save segment event received:", customEvent.detail);
                    console.log("Segment text change triggered")
                    if(JOB_ID) {                       
                    }   
                }
                document.addEventListener('change-segment-text', handleSegmentEdit)

                const handleUpdateEntities = (e: Event) => {
                    const customEvent = e as CustomEvent<{ entitiez: any; }>;
                    console.log("411 ", customEvent.detail.entitiez);
                    socket.send(new SaveTranscriptMessage(JOB_ID, customEvent.detail.entitiez, {}))

                }

                document.addEventListener('update-segment-entities', handleUpdateEntities)


                const handleSegmentDelete = (e: Event) => { 
                    const customEvent = e as CustomEvent<{ entitiez: any; }>;
                    console.log("411 ", customEvent.detail.entitiez);
                    socket.send(new DeleteSegmentMessage(JOB_ID, customEvent.detail.entitiez, {}))
                }
                document.addEventListener('delete-segment', handleSegmentDelete)


                // Cleanup
                return () => {
                    document.removeEventListener('manual-save', handleManualSave)
                    document.removeEventListener('change-segment-text', handleSegmentEdit)
                    document.removeEventListener('update-segment-entities', handleUpdateEntities)
                    document.removeEventListener('delete-segment', handleSegmentDelete)
                }
            }
        }

        socket.onMessage = (e) => {
            const message = BaseMessage.fromJson(e.data)
            console.log("WebSocket Message received:", message);

            
            switch(message.messageType) {
                case MessageType.LoadJob:
                    console.log("loaded")
                    const jobData: Job = message.data.jobData as Job
                    const transcriptData: TranscriptLoadingParams = message.data.transcriptData as TranscriptLoadingParams
                    dispatch(loadJobData(jobData))
                    dispatch(loadTranscriptData(transcriptData))
                    const groupsData = message.data.groupsData
                    dispatch(loadGroups(groupsData))

                    console.log("412 " + JSON.stringify(transcriptData))

                    // useLoadGroups() 
                    break

                case MessageType.SaveTranscript:
                    console.log("Save response received");
                    if (JOB_ID) socket.send(new LoadJobMessage(JOB_ID));

                    break

                default:
                    break
            }
        }

        socket.connect("ws://localhost:8000/ws/testos/")
    }
    

    //useFetchJob()
    //useFetchTranscript()
    // useLoadGroups()
    const waveformRegionsRef = useRef<RegionsPlugin>(RegionsPlugin.create())
    useHistory(waveformRegionsRef)
    // useSave()
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
