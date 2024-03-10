import { FC } from "react";
import Layer from "../../types/Layer";
import styled from "styled-components";


interface TooltipProps extends Layer {
    label: string
}

const StyledTooltip = styled.div<TooltipProps>`
    position: relative;
    
    &:hover, &:focus {
        ::before {
            z-index: 1001;
            content: "";
            position: absolute;
            left: 50%;
            transform: translate(-50%, 8px);
            border: 6px solid transparent;
            border-bottom: 6px solid ${({theme}) => theme.gray100};
            pointer-events: none;
            bottom: 0;
        }
        
        ::after {
            z-index: 1001;
            content: "${({label}) => label}";
            position: absolute;
            border-radius: 4px;
            background: ${({theme}) => theme.gray100};
            color: ${({theme}) => theme.textSecondary};
            padding: 2px 4px;
            left: 50%;
            transform: translate(-50%, 100%);
            pointer-events: none;
            font-size: 14px;
            bottom: -8px;
            box-shadow: 0 0 4px 0 ${({theme}) => theme.gray100};
        }
    }
`

const Tooltip: FC<TooltipProps & any> = ({layer, label, ...props}) => { // TODO: fix any
    return (
        <StyledTooltip layer={layer} label={label}>
            {props.children}
        </StyledTooltip>
    )
} 

export default Tooltip
