import { useSelector } from "react-redux"
import { useAppDispatch } from "../../../redux/hooks"
import { selectGroupsRaw, selectSegments, selectTranscriptStatus } from "../../transcript/redux/transcriptSlice"
import { useEffect } from "react"
import { adaptGroups } from "../utils/adaptGroups"
import { loadGroups } from "../redux/groupingSlice"
import { enableHistory } from "../../workspace/redux/workspaceSlice"


export const useLoadGroups = () => {
    const dispatch = useAppDispatch()
    const status = useSelector(selectTranscriptStatus)
    const segments = useSelector(selectSegments)
    const groups = useSelector(selectGroupsRaw)
    

    useEffect(() => {
        if (status !== "success")
            return

        console.log("Loading groups" + JSON.stringify(groups))

        const trasnformedData = adaptGroups(groups, segments)
        console.log("Loading groups 2" + JSON.stringify(trasnformedData.transformedGroups))
        dispatch(loadGroups(trasnformedData))
        dispatch(enableHistory())
    }, [status, segments, groups])
}
