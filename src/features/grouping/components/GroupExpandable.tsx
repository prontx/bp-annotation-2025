import { FC, useState } from "react"

// components
import Expandable from "../../../components/Expandable"
import Tag from "../../../components/Tag"
import GroupForm from "./GroupForm"
import Button from "../../../components/Button"

// styles
import styled from "styled-components"

// redux
import { useSelector } from "react-redux"
import { deleteGroup, selectGroupByID, startEditing } from "../redux/groupingSlice"
import { selectGroupStartEndByIDs } from "../../transcript/redux/transcriptSlice"
import { useAppDispatch } from "../../../redux/hooks"

// types
import Layer from "../../../types/Layer"
import { RootState } from "../../../redux/store"

// utils
import { timeToFormatedString } from "../../../utils/convertTimeAndFormatedString"


interface GroupExpandableProps extends React.HTMLAttributes<HTMLDivElement>, Layer {
    groupID: string,
    parentTags?: string[],
}

const GroupBodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    & > p {
        margin: 0 4px;
    }
`

const GroupExpandableActions = styled.div`
    display: flex;
    gap: 8px;
    margin: 4px 8px;

    & > :first-child {
        margin-left: auto;
    }
`

const GroupExpandable: FC<GroupExpandableProps> = ({$layer, groupID, parentTags, ...props}) => {
    const data = useSelector((state: RootState) => selectGroupByID(state, groupID))
    if (!data)
        return null

    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const [startTime, endTime] = useSelector((state: RootState) => selectGroupStartEndByIDs(state, data.startSegmentID, data.endSegmentID))

    const handleEditing = () => {
        dispatch(startEditing(data.parentID))
        setIsEditing(true)
    }

    if (isEditing)
        return <GroupForm $layer={$layer} groupID={groupID} parentTags={parentTags} submitCallback={() => setIsEditing(false)} />

    return (
        <Expandable title={data.title} $layer={$layer} {...props}>
            <GroupBodyContainer><>
                <p>{timeToFormatedString(startTime)} – {timeToFormatedString(endTime)}{data.publish && ", zveřejnit"}</p>
                <Tag tags={data.tags} $layer={$layer} />
                {data.childrenIDs.map(id => <GroupExpandable key={id} groupID={id} $layer={$layer} parentTags={data.tags}/>)}
                <GroupForm $layer={$layer} parentID={groupID} parentTags={data.tags} />
                <GroupExpandableActions>
                    <Button $size="l" $layer={$layer+1} onClick={handleEditing}>Upravit</Button>
                    <Button $size="l" $color="danger" $layer={$layer+1} onClick={() => dispatch(deleteGroup({id: groupID, parentID:data.parentID}))}>Smazat</Button>
                </GroupExpandableActions>
            </></GroupBodyContainer>
        </Expandable>
    )
}

export default GroupExpandable
