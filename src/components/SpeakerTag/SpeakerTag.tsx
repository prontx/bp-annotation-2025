import { FC, HTMLAttributes } from "react"

// style
import styled, { css } from "styled-components"
// @ts-ignore
import { rgba } from "@carbon/colors"


interface SpeakerTagProps extends HTMLAttributes<HTMLSpanElement> {
    speakerID: string,
    color?: string,
}

const StyledSpeakerTag = styled.span<{$color: string}>`
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
            background: ${rgba($color, 0.5)};
        }
    `}
`

const SpeakerTag: FC<SpeakerTagProps> = ({speakerID, color, ...props}) => {
    return (
        <StyledSpeakerTag $color={color || "#c6c6c6"} {...props}>
            <span className="icon">
                {speakerID}
            </span>
            {props.children}
        </StyledSpeakerTag>
    )
}

export default SpeakerTag
