import { FC } from "react"

// components
import GroupExpandable from "./GroupExpandable"
import Tag from "../../../components/Tag/Tag"
import GroupListHeader from "./GroupListHeader"

// styles
import styled from "styled-components"

// types
import Layer from "../../../types/Layer"


const GroupListContainer = styled.div<Layer>`
    border-radius: 8px 8px 0 0;
    margin-right: 8px;
    background: ${({theme, layer}) => theme.layers[layer].background};
`

const GroupList: FC<Layer & React.HTMLAttributes<HTMLDivElement>> = ({layer, ...props}) => {
    return (
        <GroupListContainer layer={layer} {...props}>
            <GroupListHeader layer={layer} />
            
            {/* TODO: SCROLLING GROUPS LIST */}
            <div style={{margin: "8px", display: "flex", flexDirection: "column", gap: "2px"}}>
                {/* TODO: implement deleteCallback */}
                <GroupExpandable
                    layer={layer}
                    startTime={0}
                    endTime={14.6}
                    title="New Group With Super Long Name"
                    tag={<Tag tagText="fooABC" sub1="bar" sub2="buz" deleteCallback={() => {}} layer={layer+1}/>}
                />
            </div>
        </GroupListContainer>
    )
}

export default GroupList