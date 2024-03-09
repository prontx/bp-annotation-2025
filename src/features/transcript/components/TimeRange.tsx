import { FC, useEffect, useState } from "react";

// components
import SubtleInput from "../../../components/basic/SubtleInput/SubtleInput";

// types
import type Layer from "../../../style/Layer";

// utils
import { formatedStringToTime, timeToFormatedString } from "../../../utils/convertTimeAndFormatedString";


interface TimeRangeProps extends Layer {
    start: number,
    end: number,
    changeHandler: (change: {start?: number, end?: number}) => void
}

const TimeRange: FC<TimeRangeProps> = ({layer, start, end, changeHandler}) => {
    const initialState = {
        start: timeToFormatedString(start),
        end: timeToFormatedString(end)
    }
    const [ rangeStrings, setRangeStrings ] = useState(initialState)
    
    useEffect(() => { // react to waveform region changes
        setRangeStrings({
            start: timeToFormatedString(start),
            end: timeToFormatedString(end)
        })
    }, [start, end])

    const handleRangeChange = (change: {start?: string, end?: string}) => {
        setRangeStrings({...rangeStrings, ...change})
        
        // if the time string is valid, update global state
        if (change.start) {
            const possibleStartNumber = formatedStringToTime(change.start)
            if (!isNaN(possibleStartNumber)){
                changeHandler({start: possibleStartNumber})
            }
        } else if (change.end) {
            const possibleEndNumber = formatedStringToTime(change.end)
            if (!isNaN(possibleEndNumber)){
                changeHandler({end: possibleEndNumber})
            }
        }
    }

    return (
        <>
            <SubtleInput
                layer={layer}
                type="text"
                value={rangeStrings.start}
                onChange={(e) => {handleRangeChange({start: e.target.value})}}
            />
            –
            <SubtleInput
                layer={layer}
                type="text"
                value={rangeStrings.end}
                onChange={(e) => {handleRangeChange({end: e.target.value})}}
            />
        </>
    )
}

export default TimeRange
