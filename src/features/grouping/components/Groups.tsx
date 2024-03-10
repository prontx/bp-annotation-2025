import { FC } from "react"

// components
import Button from "../../../components/Button/Button"
import GroupExpandable from "./GroupExpandable"
import Tag from "../../../components/Tag/Tag"

// styles
import styled from "styled-components"

// types
import Layer from "../../../types/Layer"


const GroupWrapper = styled.div<Layer>`
    border-radius: 8px 8px 0 0;
    margin-right: 8px;
    background: ${({theme, layer}) => theme.layers[layer].background};
`

const GroupHeader = styled.div<Layer>`
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid ${({theme, layer}) => theme.layers[layer].active};
    padding: 8px;
`

const Groups: FC<Layer & React.HTMLAttributes<HTMLDivElement>> = ({layer, ...props}) => {
    return (
        <GroupWrapper layer={layer} {...props}>
            <GroupHeader layer={layer}>
                    <Button variant="text" layer={layer+1} style={{width: "100%", padding: "8px"}}>+ Přidat obsahová metadata</Button>
            </GroupHeader>
            
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
        </GroupWrapper>
    )
}

export default Groups