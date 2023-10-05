import { FC } from "react";

import SpeedControls from "./SpeedControls";
import PlaybackControls from "./PlaybackControls";
import VolumeControls from "./VolumeControls";

import styled from "styled-components";

const ControlsContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 48px;
    padding: 8px 16px;
    border-radius: 0 0 8px 8px;
    background: ${({theme}) => theme.gray90};
`

const Controls : FC = () => {
    return (
        <ControlsContainer>
            <SpeedControls />
            <PlaybackControls />
            <VolumeControls />
        </ControlsContainer>
    );
}

export default Controls;
