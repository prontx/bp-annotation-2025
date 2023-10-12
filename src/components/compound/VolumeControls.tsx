import { FC } from "react";

// state management
import { useAppDispatch } from "../../redux/hooks";
import { setVolume } from "../../redux/slices/playbackSlice";

// styles
import styled from "styled-components";

// components
import Icon from "../basic/Icon/Icon";
import Slider from "../basic/Slider/Slider";

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
    const dispatch = useAppDispatch()

    const handleSliderChange = (newVal: number) => {
        dispatch(setVolume(newVal/100))
    }

    return (
        <VolumeControlsContainer>
            <p>Volume:</p>
            <Icon className="icon" variant="volumeMute" />
            <Slider min={0} max={100} defaultValue={100} onChange={(val) => handleSliderChange(val)}/>
            <Icon className="icon space" variant="volumeFull" />
        </VolumeControlsContainer>
    );
}

export default VolumeControls;
