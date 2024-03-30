import { FC } from "react"

// components
import GroupExpandable from "./GroupExpandable"
import GroupListHeader from "./GroupListHeader"

// styles
import styled from "styled-components"

// redux
import { useSelector } from "react-redux"
import { selectGroupIDs } from "../redux/groupingSlice"

// types
import Layer from "../../../types/Layer"


const GroupListContainer = styled.div<Layer>`
    border-radius: 8px 8px 0 0;
    margin-right: 8px;
    background: ${({theme, $layer}) => theme.layers[$layer].background};
`

const GroupList: FC<Layer & React.HTMLAttributes<HTMLDivElement>> = ({$layer, ...props}) => {
    const groupIDs = useSelector(selectGroupIDs)

    return (
        <GroupListContainer $layer={$layer} {...props}>
            <GroupListHeader $layer={$layer} />
            
            {/* TODO: SCROLLING GROUPS LIST */}
            <div style={{margin: "8px", display: "flex", flexDirection: "column", gap: "2px"}}>
                {groupIDs.map(id => <GroupExpandable key={id} groupID={id} $layer={$layer+1}/>)}
            </div>
        </GroupListContainer>
    )
}

export default GroupList