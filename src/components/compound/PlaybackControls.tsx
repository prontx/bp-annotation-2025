import { FC, useState } from "react";

// components
import Button from "../basic/Button/Button";
import Icon from "../basic/Icon/Icon";
import SubtleInput from "../basic/SubtleInput/SubtleInput";

// state management
import { useAppDispatch } from "../../redux/hooks";
import { play, pause, skipBackward, skipForward, skipToEnd, skipToStart, setTime } from "../../redux/slices/playbackSlice";

// styles
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// utils
import { timeToFormatedString, formatedStringToTime } from "../../utils/humanReadableTime";

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
    const displatch = useAppDispatch()
    const { isPlaying, currentTime } = useSelector((state: RootState) => state.playback)
    const [timeString, setTimeString ] = useState(timeToFormatedString(currentTime))

    const handleInputChange = (value: string, lostFocus: boolean = false) => {
        setTimeString(value)
        const possibleNumber = formatedStringToTime(value) // returns NaN if not a valid time string
        
        // if the time string is valid, update state
        if (!isNaN(possibleNumber)) {
            displatch(setTime(possibleNumber))
        }
        
        // if input lost focus, ensure last valid time string is displayed
        if (lostFocus) {
            setTimeString(timeToFormatedString(currentTime))
        }

        console.log(`state: ${currentTime}, input: ${timeString}`)
    }

    // TODO:
    // load audio length from metadata

    return (
        <PlaybackControlsContainer>
            <Button variant="icon" onClick={() => displatch(skipToStart())}><Icon variant="skipToStart" /></Button>
            <Button variant="icon" onClick={() => displatch(skipBackward())}><Icon variant="skipBackward" /></Button>
            { isPlaying
                ? <Button variant="icon" onClick={() => displatch(pause())}><Icon variant="pause" /></Button>
                : <Button variant="icon" onClick={() => displatch(play())}><Icon variant="play" /></Button> }
            <Button variant="icon" onClick={() => displatch(skipForward())}><Icon variant="skipForward" /></Button>
            <Button variant="icon" onClick={() => displatch(skipToEnd())}><Icon variant="skipToEnd" /></Button>
            <p><SubtleInput type="text" value={timeString} onChange={(e) => handleInputChange(e.target.value)} onBlur={(e) => handleInputChange(e.target.value, true)}></SubtleInput>/ <span>0:00:42.5</span></p>
        </PlaybackControlsContainer>
    );
}

export default PlaybackControls;
