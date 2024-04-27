import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectJobStatus, fetchJob } from "../redux/workspaceSlice"
import { AppDispatch } from "../../../redux/store"

export const useFetchJob = () => {
    const dispatch = useDispatch<AppDispatch>()
    const jobStatus = useSelector(selectJobStatus)

    useEffect(() => {
        if (jobStatus === "idle") {
            dispatch(fetchJob())
        }
    }, [jobStatus, fetchJob])
}