import { MutableRefObject, useEffect } from "react"
import { useSelector } from "react-redux"
import { selectLastFocusedSegment, selectSpecialChar, setSpecialChar } from "../redux/transcriptSlice"
import { useAppDispatch } from "../../../redux/hooks"

export const useInsertSpecialChars = (textAreaRef: MutableRefObject<HTMLTextAreaElement|null>, segmentID: string, words: string, changeHandler: (text: string) => void) => {
    const dispatch = useAppDispatch()
    const specialChar = useSelector(selectSpecialChar)
    const lastFocusedSegment = useSelector(selectLastFocusedSegment)

    useEffect(() => { // react to special char insertion
        if (!textAreaRef.current || !specialChar || lastFocusedSegment !== segmentID)
            return
        const selectionStart = textAreaRef.current.selectionStart
        const selectionEnd = textAreaRef.current.selectionEnd
        changeHandler(words.substring(0, selectionStart) + specialChar + words.substring(selectionEnd))
        setTimeout(() => { // this ensures that the value is updated, and that the cursor will appear at the correct place
            if (!textAreaRef.current)
                return
            textAreaRef.current.setSelectionRange(selectionStart + specialChar.length, selectionStart + specialChar.length)
            textAreaRef.current.focus();
          }, 0);
        dispatch(setSpecialChar(""))
    }, [lastFocusedSegment, specialChar])
}