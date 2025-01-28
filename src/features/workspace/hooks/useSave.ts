import { useEffect, useState } from "react"

// redux
import { useSelector } from "react-redux"
import { useAppDispatch } from "../../../redux/hooks"
import { selectSegments, selectSpeakers } from "../../transcript/redux/transcriptSlice"
import { saved, selectJobID, selectManualSave, setError } from "../redux/workspaceSlice"
import { selectGroups } from "../../grouping/redux/groupingSlice"

// types
import { TranscriptLoadingParams } from "../../transcript/types/Transcript"

// utils
import axios from "../../../utils/getAxios"
import { adaptSegments } from "../utils/adaptSegments"
import { adaptGroups } from "../utils/adaptGroups"
import { APIErrorResponse } from "../../../types/APIErrorResponse"


export const useSave = () => {
    const dispatch = useAppDispatch()
    const segments = useSelector(selectSegments)
    const speakers = useSelector(selectSpeakers)
    const groups = useSelector(selectGroups)
    const jobID = useSelector(selectJobID)
    const [changed, setChanged] = useState(false)
    const [autoSave, setAutoSave] = useState(false)
    const manualSave = useSelector(selectManualSave)

    const putTranscript = async () => {
        // transform segments and groups from local representation to API JSON format
        const segmentArr = adaptSegments(segments)
        const groupArr = adaptGroups(groups, segments)
        const transcript: Omit<TranscriptLoadingParams, "id"|"created_at"|"source"> = {
            speaker_tags: speakers,
            segments: segmentArr,
            groups: groupArr,
        }

        console.log("the groups: " + JSON.stringify(groupArr))

        // make request
        try {
            axios.put(`/${jobID}/transcript`, JSON.stringify(transcript))
        } catch (err){
            const {code, message} = err as APIErrorResponse
            dispatch(setError({code: code, message: message}))
        }
    }

    useEffect(() => { // track changes
        setChanged(true)
    }, [segments, speakers, groups])

    useEffect(() => { // save listener
        if (!manualSave && !autoSave)
            return
        
        if (changed){
            putTranscript()
        }
        setChanged(false)
        dispatch(saved())
        setAutoSave(false)
    }, [autoSave, manualSave, changed])
    
    useEffect(() => { // auto save signal every 30s
        const intervalID = setInterval(() => setAutoSave(true), 30000)
        return () => clearInterval(intervalID)
    }, [])
}
