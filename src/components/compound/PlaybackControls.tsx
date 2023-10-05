import { FC } from "react";

import Button from "../basic/Button/Button";
import Icon from "../basic/Icon/Icon";
import SubtleInput from "../basic/SubtleInput/SubtleInput";

import styled from "styled-components";

const PlaybackControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    margin-left: 150px;

    p {
        margin-left: 8px;
        color: ${({theme}) => theme.textSecondary};
    }
`

const PlaybackControls : FC = () => {

    // TODO:
    // make current time editable and two-way bound with global playing state
    // load total time from audio file metadata

    return (
        <PlaybackControlsContainer>
            <Button variant="icon"><Icon variant="skipToStart" /></Button>
            <Button variant="icon"><Icon variant="skipBackward" /></Button>
            <Button variant="icon"><Icon variant="play" /></Button>
            <Button variant="icon"><Icon variant="skipForward" /></Button>
            <Button variant="icon"><Icon variant="skipToEnd" /></Button>
            <p><SubtleInput type="text" value="0:00:00.0"></SubtleInput>/ <span>0:00:42.5</span></p>
        </PlaybackControlsContainer>
    );
}

export default PlaybackControls;
