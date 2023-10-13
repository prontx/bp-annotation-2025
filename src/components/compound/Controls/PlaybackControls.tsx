import { FC, useState } from "react";

// state management
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { play, pause, skipBy, setTime, selectLength, selectIsPlaying, selectCurrentTimeValue } from "../../../redux/slices/playbackSlice";

// styles
import styled from "styled-components";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';
import FastRewindRoundedIcon from '@mui/icons-material/FastRewindRounded'; 

// components
import Button from "../../basic/Button/Button";
import SubtleInput from "../../basic/SubtleInput/SubtleInput";

// utils
import { timeToFormatedString, formatedStringToTime } from "../../../utils/convertTimeAndFormatedString";

/**
 * A container for the playback controls that positions them.
 */
const PlaybackControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

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
    const dispatch = useAppDispatch()
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
            dispatch(setTime({value: possibleNumber, changedBy: "controlsInput"}))
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
            <Button variant="icon" onClick={() => dispatch(setTime({value: 0, changedBy: "controlsButton"}))}>
                <FastRewindRoundedIcon />
            </Button>
            <Button variant="icon" onClick={() => dispatch(skipBy({value: -1, changedBy: "controlsButton"}))}>
                <SkipPreviousRoundedIcon />
            </Button>
            { isPlaying
                ? <Button variant="icon" onClick={() => dispatch(pause())}>
                    <PauseRoundedIcon />
                </Button>
                : <Button variant="icon" onClick={() => dispatch(play())}>
                    <PlayArrowRoundedIcon />
                </Button> }
            <Button variant="icon" onClick={() => dispatch(skipBy({value: 1, changedBy: "controlsButton"}))}>
                <SkipNextRoundedIcon />
            </Button>
            <Button variant="icon" onClick={() => dispatch(setTime({value: length, changedBy: "controlsButton"}))}>
                <FastForwardRoundedIcon />
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
