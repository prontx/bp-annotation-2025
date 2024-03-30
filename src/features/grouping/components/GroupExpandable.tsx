import { FC } from "react"

// components
import Expandable from "../../../components/Expandable/Expandable"
import Tag from "../../../components/Tag/Tag"

// styles
import styled from "styled-components"

// redux
import { useSelector } from "react-redux"
import { selectGroupByID } from "../redux/groupingSlice"
import { selectGroupStartEndByIDs } from "../../transcript/redux/transcriptSlice"

// types
import Layer from "../../../types/Layer"
import { RootState } from "../../../redux/store"

// utils
import { timeToFormatedString } from "../../../utils/convertTimeAndFormatedString"


interface GroupExpandableProps extends React.HTMLAttributes<HTMLDivElement>, Layer {
    groupID: string,
}

const GroupBodyContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    & p {
        margin: 0 4px;
    }

    & > div {
        margin-right: auto;
    }
`

const GroupExpandable: FC<GroupExpandableProps> = ({$layer, groupID, ...props}) => {
    const data = useSelector((state: RootState) => selectGroupByID(state, groupID))
    if (!data)
        return null
    const [startTime, endTime] = useSelector((state: RootState) => selectGroupStartEndByIDs(state, data.startSegmentID, data.endSegmentID))

    return (
        <Expandable title={data.title} $layer={$layer} {...props}>
            <GroupBodyContainer><>
                <p>{timeToFormatedString(startTime)} – {timeToFormatedString(endTime)}</p>
                <Tag tags={data.tags} $layer={$layer}></Tag>
                {data.childrenIDs.map(id => <GroupExpandable groupID={id} $layer={$layer}/>)}
            </></GroupBodyContainer>
        </Expandable>
    )
}

export default GroupExpandable
