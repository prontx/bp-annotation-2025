import { FC, useState } from "react";

// state management
import { useAppDispatch } from "../../redux/hooks";
import { play, pause, skipBackward, skipForward, skipToEnd, skipToStart, setTime } from "../../redux/slices/playbackSlice";

// styles
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// components
import Button from "../basic/Button/Button";
import Icon from "../basic/Icon/Icon";
import SubtleInput from "../basic/SubtleInput/SubtleInput";

// utils
import { timeToFormatedString, formatedStringToTime } from "../../utils/convertTimeAndFormatedString";

/**
 * A container for the playback controls that positions them.
 */
const PlaybackControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    margin-left: 150px;

    p {
        margin-left: 8px;
    }
`

/**
 * The component contains playback control buttons, and an input to set the current time.
 * 
 * @returns {JSX.Element} PlaybackControls component
 */
const PlaybackControls : FC = () => {
    const displatch = useAppDispatch()
    const { isPlaying, currentTime } = useSelector((state: RootState) => state.playback)
    const [timeString, setTimeString ] = useState(timeToFormatedString(currentTime))
    const [isFocused, setIsFocused] = useState(false)
    
    /**
     * Set local state to `value`, and if it's valid, update global state.
     * 
     * @param {string} value changed input value
     * 
     * @returns {void}
     */
    const handleInputChange = (value: string) => {
        setTimeString(value)
        
        // if the time string is valid, update global state
        const possibleNumber = formatedStringToTime(value) // returns NaN if not a valid time string
        if (!isNaN(possibleNumber)){
            displatch(setTime(possibleNumber))
        }
    }
    
    /**
     * Returns formated time string.
     * 
     * @description
     * If input looses focus, any invalid string will be replaced with the last valid value from global state.
     * If global state changes to a new value, e.g. user clickes on a skip button, local state is updated.
     * 
     * @returns {string} formated time string
     */
    const getTimeString = () => {
        if (!isFocused) {
            const globalTimeAsString = timeToFormatedString(currentTime)
            if (globalTimeAsString !== timeString){
                setTimeString(globalTimeAsString)
            }
        }

        return timeString
    }
    
    // TODO: load audio length from metadata

    return (
        <PlaybackControlsContainer>
            <Button variant="icon" onClick={() => displatch(skipToStart())}><Icon variant="skipToStart" /></Button>
            <Button variant="icon" onClick={() => displatch(skipBackward())}><Icon variant="skipBackward" /></Button>
            { isPlaying
                ? <Button variant="icon" onClick={() => displatch(pause())}><Icon variant="pause" /></Button>
                : <Button variant="icon" onClick={() => displatch(play())}><Icon variant="play" /></Button> }
            <Button variant="icon" onClick={() => displatch(skipForward())}><Icon variant="skipForward" /></Button>
            <Button variant="icon" onClick={() => displatch(skipToEnd())}><Icon variant="skipToEnd" /></Button>
            <p>
                <SubtleInput type="text"
                    value={getTimeString()}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)} >
                </SubtleInput>/ <span>0:00:42.5</span>
            </p>
        </PlaybackControlsContainer>
    );
}

export default PlaybackControls;
