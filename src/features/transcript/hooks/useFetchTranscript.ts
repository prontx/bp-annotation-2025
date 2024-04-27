import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectTranscriptStatus, fetchTranscript } from "../redux/transcriptSlice"
import { AppDispatch } from "../../../redux/store"
import { selectJobStatus } from "../../workspace/redux/workspaceSlice"

export const useFetchTranscript = () => {
    const dispatch = useDispatch<AppDispatch>()
    const jobStatus = useSelector(selectJobStatus)
    const transcriptStatus = useSelector(selectTranscriptStatus)

    useEffect(() => {
        if (jobStatus !== "" && jobStatus !== "idle" && jobStatus !== "loading" && jobStatus !== "error"){
            if (transcriptStatus === "" || transcriptStatus === "idle") {
                dispatch(fetchTranscript())
            }
        }
    }, [jobStatus, transcriptStatus, fetchTranscript])
}