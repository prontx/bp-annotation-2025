import { FC } from "react"

// components
import GroupExpandable from "./GroupExpandable"
import GroupForm from "./GroupForm"

// styles
import styled from "styled-components"

// redux
import { useSelector } from "react-redux"
import { selectGroupIDs } from "../redux/groupingSlice"
import { selectGroupTags } from "../../job/redux/jobSlice"

// types
import Layer from "../../../types/Layer"


const GroupListContainer = styled.div<Layer>`
    border-radius: 8px 8px 0 0;
    background: ${({theme, $layer}) => theme.layers[$layer].background};
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const GroupList: FC<Layer & React.HTMLAttributes<HTMLDivElement>> = ({$layer, ...props}) => {
    const groupIDs = useSelector(selectGroupIDs)
    const groupTags = useSelector(selectGroupTags)

    return (
        <GroupListContainer $layer={$layer} {...props}>
            {/* TODO: SCROLLING GROUPS LIST */}
            {groupIDs.map(id => <GroupExpandable key={id} groupID={id} $layer={$layer+1}/>)}
            {(groupTags !== undefined)
                ? <GroupForm $layer={$layer} />
                : "Nepodařilo se načíst metadata."
            }
        </GroupListContainer>
    )
}

export default GroupList