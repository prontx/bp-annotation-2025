import { ChangeEventHandler, FC, KeyboardEventHandler, useState } from "react";

// components
import { ComboboxInput } from "../../../components/TagSelection/style/ComboboxInput";
import { Combobox } from "@reach/combobox";

// redux
import { useSelector } from "react-redux"
import { useAppDispatch } from "../../../redux/hooks";
import { selectSpeed } from "../redux/playbackSlice";
import { setSpeed } from "../redux/playbackSlice";

// style
import styled from "styled-components";

// types
import Layer from "../../../types/Layer";

const SpeedControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`

const SpeedControls : FC<Layer> = ({$layer}) => {
    const dispatch = useAppDispatch()
    const [speedStr, setSpeedStr] = useState("100")
    const speed  = useSelector(selectSpeed)

    const handleSpeedChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        // remove non-digit characters
        const newSpeedStr = e.target.value.replaceAll(/[^0-9]/g, "")
        const newSpeed = parseInt(newSpeedStr)

        // check range
        if (!isNaN(newSpeed) && newSpeed > 0 && newSpeed <= 100){
            setSpeedStr(newSpeedStr)
            dispatch(setSpeed(newSpeed))
        } else if (newSpeedStr === ""){
            setSpeedStr(newSpeedStr)
        }

    }
    
    const ensureSpeedString = () => {
        setSpeedStr(`${speed}`)
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        if (e.key === "ArrowUp" && speed < 100){
            setSpeedStr(`${speed+1}`)
            dispatch(setSpeed(speed+1))
        } else if (e.key === "ArrowDown" && speed > 1){
            setSpeedStr(`${speed-1}`)
            dispatch(setSpeed(speed-1))
        }
      }
    
    return (
        <SpeedControlsContainer>
            <p>Rychlost:</p>
            <Combobox>
                <ComboboxInput
                    style={{width: "4.5ch", textAlign: "end", marginRight: "4px"}}
                    $layer={$layer}
                    value={speedStr}
                    onChange={handleSpeedChange}
                    onBlur={ensureSpeedString}
                    onKeyDown={handleKeyDown}
                />
            %
            </Combobox>
        </SpeedControlsContainer>
    );
}

export default SpeedControls;
