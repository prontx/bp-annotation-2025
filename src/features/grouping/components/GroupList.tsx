import { FC } from "react"

// components
import GroupExpandable from "./GroupExpandable"
import GroupForm from "./GroupForm"

// styles
import styled from "styled-components"
import { scrollableBaseStyles } from "../../../style/scrollableBaseStyles"

// redux
import { useSelector } from "react-redux"
import { selectGroupIDs } from "../redux/groupingSlice"
import { selectGroupTags } from "../../workspace/redux/workspaceSlice"

// types
import Layer from "../../../types/Layer"


const GroupListContainer = styled.div<Layer>`
    ${scrollableBaseStyles}

    border-radius: 10px;
    // background: ${({theme, $layer}) => theme.layers[$layer].background};
    background: #363636;
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 100%;
    padding-bottom: 40vh;
    color: white;
    // border: 1px solid cyan
`

const GroupList: FC<Layer & React.HTMLAttributes<HTMLDivElement>> = ({$layer, ...props}) => {
    const groupIDs = useSelector(selectGroupIDs)
    const groupTags = useSelector(selectGroupTags)

    return (
        <GroupListContainer $layer={$layer} {...props}>
            {groupIDs.map(id => <GroupExpandable key={id} groupID={id} $layer={$layer}/>)}
            {(groupTags !== undefined)
                ? <GroupForm $layer={$layer+1} />
                : "Nepodařilo se načíst metadata."
            }
        </GroupListContainer>
    )
}

export default GroupList