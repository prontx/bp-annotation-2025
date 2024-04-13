import { FC, useState } from "react"

// components
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// styles
import styled, { css } from "styled-components"
import { clickableBaseStyles } from "../style/clickableBaseStyles";

// types
import Layer from "../types/Layer"


interface ExpandableProps extends React.HTMLAttributes<HTMLDivElement>, Layer {
    title?: string,
    editing?: boolean
}

const ExpandableContainer = styled.div<Layer>`
    border: 2px solid ${({theme, $layer}) => theme.layers[$layer+1].background};
    border-radius: 4px;
    width: 100%;

    & .body {
        padding: 4px;
    }
`

const ExpandableHeader = styled.div<Layer>` ${({theme, $layer}) => css`
    ${clickableBaseStyles};
    border-radius: 2px;

    background: ${theme.layers[$layer+1].background};
    padding: 4px 8px;
    display: flex;
    align-items: center;
    
    &:hover {
        background: ${theme.layers[$layer+1].hover};
    }
    
    &:active {
        background: ${theme.layers[$layer+1].active};
    }
    
    & h2 {
        font-size: ${theme.heading_m};
        font-weight: 600;
        margin-right: auto;
    }
`}`

const Expandable: FC<ExpandableProps> = ({$layer, ...props}) => {
    const [ open, setOpen ] = useState(true)

    return (
        <ExpandableContainer $layer={$layer}>
            <ExpandableHeader $layer={$layer} onClick={() => setOpen(!open)}>
                <h2>{props.title}</h2>
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ExpandableHeader>
            {open && <div className="body">
                {props.children}
            </div>}
        </ExpandableContainer>
    )
}

export default Expandable