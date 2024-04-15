import { ChangeEventHandler, FC, MutableRefObject, TextareaHTMLAttributes, useEffect, useRef } from "react"

// style
import styled, { css } from "styled-components"
import { editableBaseStyles } from "../../../style/editableBaseStyles"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { setLastFocusedSegment } from "../redux/transcriptSlice"

// types
import Layer from "../../../types/Layer"
import { useInsertSpecialChars } from "../hooks/useInsertSpecialChars"


interface SegmentTextProps extends Layer, TextareaHTMLAttributes<HTMLTextAreaElement>{
    segmentID: string,
    words: string,
    changeHandler: (text: string) => void,
}

const StyledSegmentText = styled.textarea<Layer>` ${({theme, $layer}) => css`
    ${editableBaseStyles}
    
    font-size: 1rem;
    font-family: Arial;
    color: currentColor;
    padding: 2px 8px;
    width: 100%;
    background: ${theme.layers[$layer].background};
    height: 1.65rem;
    resize: vertical;
    margin-top: 4px;
    
    &:hover {
        background: ${theme.layers[$layer].hover};
        color: ${theme.textPrimary};
    }
    
    &:active, &:focus {
        background: ${theme.layers[$layer].active};
        outline: none;
        color: ${theme.textPrimary};
    }
`}`

const SegmentText: FC<SegmentTextProps> = ({segmentID, words, changeHandler, ...props}) => {
    const textAreaRef: MutableRefObject<HTMLTextAreaElement|null> = useRef(null)
    const dispatch = useAppDispatch()

    useEffect(() => { // set initial textarea height based on content
        if (textAreaRef.current)
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
    }, [])

    useInsertSpecialChars(textAreaRef, segmentID, words, changeHandler)

    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        changeHandler(e.target.value)
        if (textAreaRef.current)
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
    }

    return (
        <StyledSegmentText
            ref={textAreaRef}
            value={words}
            spellCheck="false"
            onFocus={() => dispatch(setLastFocusedSegment(segmentID))}
            onChange={handleChange}
            {...props}
        />
    )
}

export default SegmentText
