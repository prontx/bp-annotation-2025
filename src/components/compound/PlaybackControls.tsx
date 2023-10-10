import { FC, useState } from "react";

// state management
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../redux/hooks";
import { play, pause, skipBy, setTime, selectLength, selectIsPlaying, selectCurrentTimeValue } from "../../redux/slices/playbackSlice";

// styles
import styled from "styled-components";

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
    const isPlaying = useSelector(selectIsPlaying)
    const length = useSelector(selectLength)
    const currentTimeValue = useSelector(selectCurrentTimeValue)
    const [timeString, setTimeString ] = useState(timeToFormatedString(currentTimeValue))
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
            displatch(setTime({value: possibleNumber, changedBy: "controlsInput"}))
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
    const getCurrentTimeString = () => {
        if (!isFocused) {
            const globalTimeAsString = timeToFormatedString(currentTimeValue)
            if (globalTimeAsString !== timeString){
                setTimeString(globalTimeAsString)
            }
        }

        return timeString
    }
    
    return (
        <PlaybackControlsContainer>
            <Button variant="icon" onClick={() => displatch(setTime({value: 0, changedBy: "controlsButton"}))}>
                <Icon variant="skipToStart" />
            </Button>
            <Button variant="icon" onClick={() => displatch(skipBy({value: -1, changedBy: "controlsButton"}))}>
                <Icon variant="skipBackward" />
            </Button>
            { isPlaying
                ? <Button variant="icon" onClick={() => displatch(pause())}>
                    <Icon variant="pause" />
                </Button>
                : <Button variant="icon" onClick={() => displatch(play())}>
                    <Icon variant="play" />
                </Button> }
            <Button variant="icon" onClick={() => displatch(skipBy({value: 1, changedBy: "controlsButton"}))}>
                <Icon variant="skipForward" />
            </Button>
            <Button variant="icon" onClick={() => displatch(setTime({value: length, changedBy: "controlsButton"}))}>
                <Icon variant="skipToEnd" />
            </Button>
            <p>
                <SubtleInput type="text"
                    value={getCurrentTimeString()}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)} >
                </SubtleInput>/ {length ? timeToFormatedString(length) : ""}
            </p>
        </PlaybackControlsContainer>
    );
}

export default PlaybackControls;
