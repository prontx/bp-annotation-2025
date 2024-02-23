import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectTranscriptStatus, fetchTranscript } from "../redux/transcriptSlice"
import { AppDispatch } from "../../../redux/store"
import { selectJobStatus } from "../../job/redux/jobSlice"

export const useFetchTranscript = () => {
    const dispatch = useDispatch<AppDispatch>()
    const jobStatus = useSelector(selectJobStatus)
    const transcriptStatus = useSelector(selectTranscriptStatus)

    // TODO: check job's loaded and then fetch job.url.transcript

    useEffect(() => {
        if (jobStatus !== "" && jobStatus !== "idle" && jobStatus !== "loading" && jobStatus !== "error"){
            if (transcriptStatus === "" || transcriptStatus === "idle") {
                dispatch(fetchTranscript())
            }
        }
    }, [jobStatus, transcriptStatus, fetchTranscript])
}