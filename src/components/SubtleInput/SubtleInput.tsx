import { FC, useEffect, useState } from "react";

// style
import styled from "styled-components";
import { editableBaseStyles } from "../../style/editableBaseStyles";

// types
import Layer from "../../types/Layer";

// utils
import { formatedStringToTime, timeToFormatedString } from "../../utils/convertTimeAndFormatedString";


interface SubtleInputProps extends Layer, React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    time: number,
    globalStateUpdateCallback: (value: number) => void
}

const CustomInput: FC<SubtleInputProps> = ({layer, time, globalStateUpdateCallback, ...props}) => {
    const [isFocused, setIsFocused] = useState(false)
    const [timeString, setTimeString] = useState(timeToFormatedString(time))

    useEffect(() => { // set local time string value on global change
        if (!isFocused){
            setTimeString(timeToFormatedString(time))
        }
    }, [time, isFocused])

    useEffect(() => { // update global state on blur, reset local state if invalid
        if (isFocused)
            return

        const newTime = formatedStringToTime(timeString) // returns NaN if not a valid time string
        if (!isNaN(newTime)){
            globalStateUpdateCallback(newTime)
        } else {
            setTimeString(timeToFormatedString(time))
        }
    }, [isFocused])

    return (
        <input
            type="text"
            value={timeString}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setTimeString(e.target.value)}
            {...props}
        />
    )
}

const SubtleInput = styled(CustomInput)`
    ${editableBaseStyles}
    font-size: 1rem;
    color: currentColor;
    padding: 2px 4px;
    display: inline;
    width: 80px;
    background: ${({theme, layer}) => theme.layers[layer-1].background};
    
    &:hover, &:focus {
        background: ${({theme, layer}) => theme.layers[layer].background};
        outline: 2px solid ${({theme, layer}) => theme.layers[layer].active};
        color: ${({theme}) => theme.textPrimary};
    }
`

export default SubtleInput;
