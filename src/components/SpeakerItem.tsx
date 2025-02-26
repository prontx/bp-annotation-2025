import { FC, HTMLAttributes } from "react"

// style
import styled, { css } from "styled-components"
// @ts-ignore
import { rgba } from "@carbon/colors"


interface SpeakerItemProps extends HTMLAttributes<HTMLSpanElement> {
    speakerID: string,
    color?: string,
}

const StyledSpeakerItem = styled.span<{$color: string}>`
    ${({theme, $color}) => css`
        display: flex;
        align-items: center;
        gap: 4px;

        .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${theme.text_xs};
            font-weight: bold;
            width: 20px;
            height: 20px;
            border-radius: 12px;
            border: 2px solid ${$color};
            background: ${rgba($color, 1)};
            color:white;
        }
    `}
`

const SpeakerItem: FC<SpeakerItemProps> = ({speakerID, color, ...props}) => {
    return (
        <StyledSpeakerItem $color={color || "#FB3640"} {...props}>
            <span className="icon">
                {speakerID}
            </span>
            {props.children}
        </StyledSpeakerItem>
    )
}

export default SpeakerItem
