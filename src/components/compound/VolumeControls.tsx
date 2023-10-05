import { FC } from "react";

import Icon from "../basic/Icon/Icon";
import Slider from "../basic/Slider/Slider";

import styled from "styled-components";

const VolumeControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;

    p {
        margin-right: 12px;
    }

    .icon {
        fill: ${({theme}) => theme.textSecondary};
        stroke: ${({theme}) => theme.textSecondary};
    }

    .space {
        margin-left: 16px;
    }
`

const VolumeControls : FC = () => {

    // TODO:
    // bind value to global volume state

    return (
        <VolumeControlsContainer>
            <p>Volume:</p>
            <Icon className="icon" variant="volumeMute" />
            <Slider min={0} max={100} defaultValue={100} />
            <Icon className="icon space" variant="volumeFull" />
        </VolumeControlsContainer>
    );
}

export default VolumeControls;
