import { FC, useState } from "react"

// components
import Expandable from "../../../components/Expandable"
import TagSet from "./TagSet.tsx.tsx"
import GroupForm from "./GroupForm"
import Button from "../../../components/Button"

// styles
import styled from "styled-components"

// redux
import { useSelector } from "react-redux"
import { deleteGroup, selectGroupByID, selectIsEditing, startEditing } from "../redux/groupingSlice"
import { selectGroupStartEndByIDs } from "../../transcript/redux/transcriptSlice"
import { useAppDispatch } from "../../../redux/hooks"

// types
import Layer from "../../../types/Layer"
import { RootState } from "../../../redux/store"

// utils
import { time2FormatedString } from "../../../utils/time2FormatedString.ts"
import { GroupTag } from "../../transcript/types/Tag.ts"


interface GroupExpandableProps extends React.HTMLAttributes<HTMLDivElement>, Layer {
    groupID: string,
    parentTags?: GroupTag[],
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
    const data = useSelector((state: RootState) => selectGroupByID(state)(groupID))
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const globalEditing = useSelector(selectIsEditing)
    const [startTime, endTime] = useSelector((state: RootState) => selectGroupStartEndByIDs(state)(data?.startSegmentID, data?.endSegmentID))
    
    const handleEditing = () => {
        // @ts-ignore if data is undefined, component returns null and the handler is never called
        dispatch(startEditing(data.parentID))
        setIsEditing(true)
    }
    
    if (!data)
        return null
    
    if (isEditing)
        return <GroupForm $layer={$layer+1} groupID={groupID} submitCallback={() => setIsEditing(false)} />

    return (
        <Expandable title={data.title} $layer={$layer} {...props}>
            <GroupBodyContainer><>
                <p>{time2FormatedString(startTime)} – {time2FormatedString(endTime)}{data.publish && ", zveřejnit"}</p>
                <TagSet tags={data.tags} $layer={$layer+1} />
                {data.childrenIDs.map(id => <GroupExpandable key={id} groupID={id} $layer={$layer} parentTags={data.tags}/>)}
                <GroupForm $layer={$layer+1} parentID={groupID} parentTags={data.tags} />
                <GroupExpandableActions>
                    <Button
                        $size="l"
                        $layer={$layer+1}
                        onClick={handleEditing}
                        disabled={globalEditing}
                        >
                        Upravit
                    </Button>
                    <Button
                        $size="l"
                        $color="danger"
                        $layer={$layer+1}
                        onClick={() => dispatch(deleteGroup({id: groupID, parentID:data.parentID}))}
                        disabled={globalEditing}
                    >
                        Smazat
                    </Button>
                </GroupExpandableActions>
            </></GroupBodyContainer>
        </Expandable>
    )
}

export default GroupExpandable
