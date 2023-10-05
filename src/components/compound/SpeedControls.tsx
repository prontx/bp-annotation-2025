import { FC } from "react";

import Dropdown from "../basic/Dropdown/Dropdown";

import styled from "styled-components";

const SpeedControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
`

const SpeedControls : FC = () => {

    // TODO:
    // bind with global state

    return (
        <SpeedControlsContainer>
            <p>Speed:</p>
            <Dropdown variant="text" selectedOption="1x" options={["1x", "0.9x", "0.8x", "0.7x", "0.6x", "0.5x"]}/>
        </SpeedControlsContainer>
    );
}

export default SpeedControls;
