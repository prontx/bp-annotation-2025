import { FC, useState } from "react"

// components
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// styles
import styled from "styled-components"
import { clickableBaseStyles } from "../../../style/clickableBaseStyles";

// types
import Layer from "../../../style/Layer"
import { ExpandableProps } from "./types/ExpandableProps"


const ExpandableContainer = styled.div<Layer>`
    border: 2px solid ${({theme, layer}) => theme.layers[layer+1].background};
    border-radius: 4px;

    & .body {
        padding: 4px;
    }
`

const ExpandableHeader = styled.div<Layer>`
    ${clickableBaseStyles};
    border-radius: 2px;

    background: ${({theme, layer}) => theme.layers[layer+1].background};
    padding: 4px 8px;
    display: flex;
    align-items: center;
    
    &:hover {
        background: ${({theme, layer}) => theme.layers[layer+1].hover};
    }

    &:active {
        background: ${({theme, layer}) => theme.layers[layer+1].active};
    }
    
    & p {
        font-weight: 600;
        margin-right: auto;
    }
`

const Expandable: FC<ExpandableProps> = ({layer, ...props}) => {
    const [ open, setOpen ] = useState(false)

    return (
        <ExpandableContainer layer={layer}>
            <ExpandableHeader layer={layer} onClick={() => setOpen(!open)}>
                <p>{props.title}</p>
                {open ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </ExpandableHeader>
            {open && <div className="body">
                {props.children}
            </div>}
        </ExpandableContainer>
    )
}

export default Expandable