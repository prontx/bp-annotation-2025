import { ChangeEventHandler, FC, MutableRefObject, TextareaHTMLAttributes, useEffect, useRef, useState } from "react"

// style
import styled, { css } from "styled-components"
import { editableBaseStyles } from "../../../style/editableBaseStyles"

// redux
import { useSelector } from "react-redux"
import { useAppDispatch } from "../../../redux/hooks"
import { selectSegmentWords, setLastFocusedSegment, updateSegment } from "../redux/transcriptSlice"
import { RootState } from "../../../redux/store"

// types
import Layer from "../../../types/Layer"
import { useInsertSpecialChars } from "../hooks/useInsertSpecialChars"


interface SegmentTextProps extends Layer, TextareaHTMLAttributes<HTMLTextAreaElement>{
    segmentID: string,
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

const SegmentText: FC<SegmentTextProps> = ({segmentID, ...props}) => {
    const textAreaRef: MutableRefObject<HTMLTextAreaElement|null> = useRef(null)
    const dispatch = useAppDispatch()
    const words = useSelector((state: RootState) => selectSegmentWords(state)(segmentID))
    const [text, setText] = useState(words)

    useEffect(() => { // set initial textarea height based on content
        if (textAreaRef.current)
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
    }, [])

    useEffect(() => {
        setText(words)
    }, [words])

    useInsertSpecialChars(textAreaRef, segmentID, text, setText)

    const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setText(e.target.value)
        if (textAreaRef.current)
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
    }

    const updateGlobalState = (text: string) => {
        dispatch(updateSegment({
            type: "id",
            key: segmentID,
            change: {words: text},
        }))
    }

    return (
        <StyledSegmentText
            ref={textAreaRef}
            value={text}
            spellCheck="false"
            onFocus={() => dispatch(setLastFocusedSegment(segmentID))}
            onChange={handleChange}
            onBlur={() => updateGlobalState(text)}
            {...props}
        />
    )
}

export default SegmentText
