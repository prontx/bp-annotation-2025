import { FC, ReactElement } from "react"

// components
import Expandable from "../../../components/Expandable/Expandable"

// styles
import styled from "styled-components"

// types
import { ExpandableProps } from "../../../components/Expandable/types/ExpandableProps"

// utils
import { timeToFormatedString } from "../../../utils/convertTimeAndFormatedString"


interface GroupExpandableProps extends ExpandableProps {
    startTime: number,
    endTime: number,
    tag: ReactElement<any, any>
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

const GroupExpandable: FC<GroupExpandableProps> = ({layer, ...props}) => {
    return (
        <Expandable title={props.title} layer={layer}>
            <GroupBodyContainer><>
                <p>{timeToFormatedString(props.startTime)} – {timeToFormatedString(props.endTime)}</p>
                {props.tag}
                {props.children}
            </></GroupBodyContainer>
        </Expandable>
    )
}

export default GroupExpandable
