import { FC } from "react";

import { useSelector } from "react-redux"
import { useAppDispatch } from "../../../redux/hooks";
import { selectSpeed } from "../redux/playbackSlice";
import { setSpeed } from "../redux/playbackSlice";

import DropdownSelection from "../../../components/DropdownSelection/DropdownSelection";

import styled from "styled-components";
import Layer from "../../../types/Layer";

const SpeedControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`

const SpeedControls : FC<Layer> = ({layer}) => {
    const dispatch = useAppDispatch()
    const speed  = useSelector(selectSpeed)

    const handleSpeedChange = (speed: number) => {
        dispatch(setSpeed(speed))
    }
    
    return (
        <SpeedControlsContainer>
            <p>Speed:</p>
            <DropdownSelection layer={layer} variant="speed" onSelection={handleSpeedChange} initialState={speed} options={[1, 0.9, 0.8, 0.7, 0.6, 0.5]}/>
        </SpeedControlsContainer>
    );
}

export default SpeedControls;
