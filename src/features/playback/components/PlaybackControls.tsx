import { FC, useEffect, useState } from "react";

// redux
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../../redux/hooks";
import { play, pause, skipBy, setTime, selectIsPlaying, selectCurrentTimeValue } from "../redux/playbackSlice";
import { selectDuration } from "../../job/redux/jobSlice";

// styles
import styled from "styled-components";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import FastForwardRoundedIcon from '@mui/icons-material/FastForwardRounded';
import FastRewindRoundedIcon from '@mui/icons-material/FastRewindRounded';
import Layer from "../../../style/Layer";

// components
import Button from "../../../components/basic/Button/Button";
import SubtleInput from "../../../components/basic/SubtleInput/SubtleInput";

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
const PlaybackControls : FC<Layer> = ({layer}) => {
    const dispatch = useAppDispatch()
    const isPlaying = useSelector(selectIsPlaying)
    const length = useSelector(selectDuration)
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

    // set local time string value on global change
    useEffect(() => {
        if (!isFocused){
            setTimeString(timeToFormatedString(currentTimeValue))
        }
    }, [currentTimeValue, isFocused])
    
    return (
        <PlaybackControlsContainer>
            <Button layer={layer} variant="icon" onClick={() => dispatch(setTime({value: 0, changedBy: "controlsButton"}))}>
                <FastRewindRoundedIcon />
            </Button>
            <Button layer={layer} variant="icon" onClick={() => dispatch(skipBy({value: -1, changedBy: "controlsButton"}))}>
                <SkipPreviousRoundedIcon />
            </Button>
            { isPlaying
                ? <Button layer={layer} variant="icon" onClick={() => dispatch(pause())}>
                    <PauseRoundedIcon />
                </Button>
                : <Button layer={layer} variant="icon" onClick={() => dispatch(play())}>
                    <PlayArrowRoundedIcon />
                </Button> }
            <Button layer={layer} variant="icon" onClick={() => dispatch(skipBy({value: 1, changedBy: "controlsButton"}))}>
                <SkipNextRoundedIcon />
            </Button>
            <Button layer={layer} variant="icon" onClick={() => dispatch(setTime({value: length, changedBy: "controlsButton"}))}>
                <FastForwardRoundedIcon />
            </Button>
            <p>
                <SubtleInput layer={layer} type="text"
                    value={timeString}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)} >
                </SubtleInput>/ {length ? timeToFormatedString(length) : ""}
            </p>
        </PlaybackControlsContainer>
    );
}

export default PlaybackControls;
