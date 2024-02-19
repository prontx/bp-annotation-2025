import { FC, useState } from "react"

// components
import Button from "../../basic/Button/Button"
import GroupExpandable from "./components/GroupExpandable"
import Tag from "../../basic/Tag/Tag"

// styles
import styled from "styled-components"

// types
import Layer from "../../../style/Layer"


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
    const [ editing, setEditing ] = useState(false)

    return (
        <GroupWrapper layer={layer} {...props}>
            <GroupHeader layer={layer}>
                    <Button variant="text" layer={layer+1} style={{width: "100%", padding: "8px"}}>+ Přidat obsahová metadata</Button>
            </GroupHeader>
            
            {/* TODO: SCROLLING GROUPS LIST */}
            <div style={{margin: "8px", display: "flex", flexDirection: "column", gap: "2px"}}>
                {/* TODO: implement deleteCallback */}
                <GroupExpandable layer={layer} startTime={0}
                    endTime={14.6} title="New Group With Super Long Name"
                    tag={<Tag deleteCallback={() => {}} tag="fooABC" layer={layer+1}/>}>
                </GroupExpandable>
                {/* <Expandable layer={layer} title="New Group With Super Long Name">
                    foo
                    bar
                    <Expandable layer={layer} title="Subgroup">
                        buz
                        <Expandable layer={layer} title="Subgroup">
                            buz
                        </Expandable>
                    </Expandable>
                </Expandable>
                <Expandable layer={layer} title="Group #2">
                    <SubtleInput layer={layer+1} type="text" value={"0:45:12.5"} onChange={() => {}} />
                    –
                    <SubtleInput layer={layer+1} type="text" value={"0:57:34.8"} onChange={() => {}} />
                </Expandable> */}
            </div>
        </GroupWrapper>
    )
}

export default Groups