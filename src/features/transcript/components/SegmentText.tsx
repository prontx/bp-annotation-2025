import { ChangeEvent, FC, InputHTMLAttributes } from "react"

// style
import styled, { css } from "styled-components"
import { editableBaseStyles } from "../../../style/editableBaseStyles"

// types
import Layer from "../../../types/Layer"


interface SegmentTextProps extends Layer, InputHTMLAttributes<HTMLTextAreaElement>{
    words: string,
    changeHandler: (text: string) => void,
}

const StyledSegmentText = styled.textarea<Layer>` ${({theme, $layer}) => css`
    ${editableBaseStyles}
    
    font-size: 1rem;
    color: currentColor;
    padding: 2px 8px;
    width: 100%;
    background: ${theme.layers[$layer].background};
    font-family: inherit;
    height: 1.65rem;
    resize: vertical;
    margin-top: 4px;
    
    &:hover, &:focus {
        background: ${theme.layers[$layer].active};
        outline: none;
        color: ${theme.textPrimary};
    }
`}`

const SegmentText: FC<SegmentTextProps> = ({words, changeHandler, ...props}) => {

    const foo = (e: ChangeEvent<HTMLTextAreaElement>) => {
        // TODO: on copy/paste: filter html tags, remove formatting etc.
        changeHandler(e.target.value)
    }

    return (
        <StyledSegmentText value={words} spellCheck="false" onChange={foo} {...props} />
    )
}

export default SegmentText
