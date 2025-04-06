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
import { delayedSave, enableHistory, loadJobData, saved, selectJobID, setError } from "./features/workspace/redux/workspaceSlice"
import { useSelector } from "react-redux"
import { loadGroups, selectGroups } from "./features/grouping/redux/groupingSlice"

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
import { BaseMessage, DeleteSegmentMessage, LoadJobMessage, MessageType, SaveGroupsMessage, SaveTranscriptMessage } from "./features/connection/messages"
import { useAppDispatch } from "./redux/hooks"
import { Job } from "./features/workspace/types/Job"
import { deleteSegment, loadTranscriptData, selectGroupsRaw, selectSegments, selectTranscriptStatus } from "./features/transcript/redux/transcriptSlice"
import { TranscriptLoadingParams } from "./features/transcript/types/Transcript"
import { adaptGroups, convertGroupsForBackend } from "./features/grouping/utils/adaptGroups"
import { save } from "./features/workspace/redux/workspaceSlice"
import { RootState, store } from "./redux/store"
import { adaptSegments } from "./features/transcript/utils/adaptSegments"
import { Lookup } from "./types/Lookup"
import { Segment } from "./features/transcript/types/Segment"
import { Group, GroupLoadingParams } from "./features/grouping/types/Group"


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

    const snakeToCamel = (str: string) => 
    str.replace(/([-_][a-z])/gi, group => group.toUpperCase()
        .replace('-', '')
        .replace('_', '')
    );

    const normalizeObject = (obj: any): any => {
        if (Array.isArray(obj)) {
            return obj.map(normalizeObject);
        } else if (obj !== null && obj.constructor === Object) {
            return Object.keys(obj).reduce((acc, key) => {
                const camelKey = snakeToCamel(key);
                acc[camelKey] = normalizeObject(obj[key]);
                return acc;
            }, {} as any);
        }
        return obj;
    };

    const convertLoadedGroup = (backendGroup: any, segments: Lookup<Segment>): GroupLoadingParams => {
        // Find matching segments using both ID and timestamp
        const findSegment = (id: string, time: number, type: 'start'|'end') => {
            return Object.values(segments.entities).find(s => 
                s.id === id || Math.abs(s[type] - time) < 0.1
            );
        };
    
        const startSegment = findSegment(
            backendGroup.start_segment_i_d || backendGroup.startSegmentID,
            backendGroup.start,
            'start'
        );
        
        const endSegment = findSegment(
            backendGroup.end_segment_i_d || backendGroup.endSegmentID, 
            backendGroup.end,
            'end'
        );
    
        return {
            ...backendGroup,
            startSegmentID: startSegment?.id || '',
            endSegmentID: endSegment?.id || '',
            childrenIDs: backendGroup.children_i_ds || backendGroup.childrenIDs || []
        };
    };
      


    if(socket.isDisconnected()) {
        socket.onReady = (e) => {
            console.log("Websocket server connected")
            if (JOB_ID !== null) {
                console.log("Sending loadJob request")
                socket.send(new LoadJobMessage(JOB_ID))
                // socket.send(new SaveTranscriptMessage(JOB_ID))
                

                let currentSegments: Lookup<Segment> = { keys: [], entities: {} };
                const handleSegmentsLoad = (e: Event) => { 
                    const customEvent = e as CustomEvent<{ segments: any; transformedSegments: any }>;
                    currentSegments = customEvent.detail.transformedSegments;
                    console.log("779 " + JSON.stringify(currentSegments))
                }
                document.addEventListener('load-segments', handleSegmentsLoad)


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


                const handleSaveGroups = (e: Event) => {
                  const customEvent = e as CustomEvent<{ gr: Lookup<Group> }>;
                  console.log("41111 ", customEvent.detail.gr);
                  
                  if (!currentSegments.keys || currentSegments.keys.length === 0) {
                      console.warn("Segmenty ještě nejsou načteny, nelze uložit skupiny.");
                      return;
                  }
                  
                  // const backendGroups = convertGroupsForBackend(customEvent.detail.gr, currentSegments);
                  // console.log("Sending groups to backend:", JSON.stringify(backendGroups));

                  // socket.send(new SaveGroupsMessage(JOB_ID!, {}, backendGroups));
                  socket.send(new SaveGroupsMessage(JOB_ID!, currentSegments, customEvent.detail.gr));
              };

                  
                document.addEventListener('save-groups', handleSaveGroups);

                // Cleanup
                return () => {
                    document.removeEventListener('manual-save', handleManualSave)
                    document.removeEventListener('change-segment-text', handleSegmentEdit)
                    document.removeEventListener('update-segment-entities', handleUpdateEntities)
                    document.removeEventListener('delete-segment', handleSegmentDelete)
                    document.removeEventListener('save-groups', handleSaveGroups)
                    document.removeEventListener('load-segments', handleSegmentsLoad)
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
                    console.log("the transcript" + JSON.stringify(transcriptData))
                    dispatch(loadJobData(jobData))
                    dispatch(loadTranscriptData(transcriptData))
                    const groupsData = message.data.groupsData
                    console.log("444     " + JSON.stringify(groupsData) + "\n\n" + JSON.stringify(transcriptData))
                
                    // const transformedSegments = adaptSegments(transcriptData.segments as any)

                    // const transformedData = adaptGroups(groupsData, transformedSegments)
                    // console.log("888" + JSON.stringify(transformedData))

                    // dispatch(loadGroups(transformedData))
                    // dispatch(enableHistory())

                    // console.log("412 " + JSON.stringify(transcriptData))


                    // Adapt segments first (preserving original IDs)
    const segments = adaptSegments(transcriptData.segments);
    console.log("Transformed segments:", segments);
    
    // Normalize and convert groups
    const backendGroups = Array.isArray(message.data.groupsData) 
        ? message.data.groupsData
        : [message.data.groupsData];
        console.log("Raw backendGroups:", backendGroups);

    
    const normalizedGroups = backendGroups.map(g => ({
        ...g,
        startSegmentID: g.start_segment_i_d,
        endSegmentID: g.end_segment_i_d,
        childrenIDs: g.children_i_ds || []
    }));
    console.log("Normalized groups data (as array):", normalizedGroups);
    
    const adaptedGroups = adaptGroups(normalizedGroups, segments);
    console.log("Transformed data:", adaptedGroups);
    dispatch(loadGroups(adaptedGroups));





//                     const backendGroups = message.data.groupsData;
//                     console.log("Raw backendGroups:", backendGroups);


//                     const normalizedGroupsData = Array.isArray(backendGroups)
//                     ? backendGroups.map(normalizeObject)
//                     : [normalizeObject(backendGroups)];

//                     console.log("Normalized groups data (as array):", normalizedGroupsData);



//                     // Now use normalizedGroupsData:
// const segments = adaptSegments(message.data.transcriptData.segments);
// console.log("Transformed segments:", segments);
// const convertedGroups = normalizedGroupsData.map((grp: any) => convertLoadedGroup(grp, segments));
// console.log("Converted groups:", convertedGroups);

// const transformedData = adaptGroups(convertedGroups, segments);
// console.log("Transformed data:", transformedData);






//                     dispatch(loadGroups(transformedData))
                    // const { transformedGroups, startSegment2Group, endSegment2Group } = 
                    //   adaptGroups(backendGroups, segments);

                    // dispatch(loadGroups({ transformedGroups, startSegment2Group, endSegment2Group }));

                    // useLoadGroups() 
                    break

                case MessageType.SaveTranscript:
                    console.log("Save response received");
                    if (JOB_ID) socket.send(new LoadJobMessage(JOB_ID));

                    break

                case MessageType.SaveGroups:
                    console.log("Groups saved, refreshing data...");
                    console.log("030 " + JSON.stringify(message.data.groupsData) + JSON.stringify(message.data.transcriptData)) 
                    if (JOB_ID) {
                      // Refresh all data to ensure consistency
                      // socket.send(new LoadJobMessage(JOB_ID));
                    }
                    
                    break;

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
