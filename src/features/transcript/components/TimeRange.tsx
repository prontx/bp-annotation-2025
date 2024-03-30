import { FC } from "react";

// components
import SubtleInput from "../../../components/SubtleInput/SubtleInput";

// types
import type Layer from "../../../types/Layer";


interface TimeRangeProps extends Layer {
    start: number,
    end: number,
    changeHandler: (change: {start?: number, end?: number}) => void
}

const TimeRange: FC<TimeRangeProps> = ({$layer, start, end, changeHandler}) => {
    return (
        <>
            <SubtleInput
                $layer={$layer}
                time={start}
                globalStateUpdateCallback={(newStart: number) => changeHandler({start: newStart})}
            />
            –
            <SubtleInput
                $layer={$layer}
                time={end}
                globalStateUpdateCallback={(newEnd: number) => changeHandler({end: newEnd})}
            />
        </>
    )
}

export default TimeRange
