import { FC, Dispatch, SetStateAction, useState, useEffect, SyntheticEvent } from "react"

// components
import Button from "../../../components/Button"
import EditIcon from '@mui/icons-material/Edit';

// style
import styled from "styled-components"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { selectIsSelecting, selectSelectedSegmentID, beginSelecting, resetSelecting } from "../redux/groupingSlice"
import { useSelector } from "react-redux"
import { selectSegmentEndByID, selectSegmentStartByID } from "../../transcript/redux/transcriptSlice"

// types
import Layer from "../../../types/Layer"
import { RootState } from "../../../redux/store"

// utils
import { timeToFormatedString } from "../../../utils/convertTimeAndFormatedString"


interface StartEndSelectionProps extends Layer {
    startSegmentID: string,
    endSegmentID: string,
    setStartSegmentID: Dispatch<SetStateAction<string>>,
    setEndSegmentID: Dispatch<SetStateAction<string>>,
}

const StartEndSelectionContainer = styled.div`
    display: flex;
    align-items: center;
    height: 2.5rem;

    & .separator {
        margin: 0 4px;
        flex: 0 1 0;
    }

    & button {
        flex: 1 0 25%;
        height: 100%;
    }
`

const StartEndSelection: FC<StartEndSelectionProps> = ({$layer, startSegmentID, setStartSegmentID, endSegmentID, setEndSegmentID}) => {
    const dispatch = useAppDispatch()
    const [selecting, setSelecting] = useState<"start"|"end"|null>(null)
    const isSelecting = useSelector(selectIsSelecting)
    const selectedSegmentID = useSelector(selectSelectedSegmentID)
    const startTime = useSelector((state: RootState) => selectSegmentStartByID(state, startSegmentID))
    const endTime = useSelector((state: RootState) => selectSegmentEndByID(state, endSegmentID))

    const handleBeginSelecting = (e: SyntheticEvent, type: "start"|"end") => {
        e.preventDefault() // prevent group form submission
        dispatch(beginSelecting())
        setSelecting(type)
    }

    useEffect(() => {
        if (!isSelecting || !selectedSegmentID || !selecting)
            return

        if (selecting === "start"){
            setStartSegmentID(selectedSegmentID)
        } else if (selecting === "end"){
            setEndSegmentID(selectedSegmentID)
        }

        setSelecting(null)
        dispatch(resetSelecting())
    }, [dispatch, selecting, isSelecting, selectedSegmentID, setStartSegmentID, setEndSegmentID])

    return (
    <StartEndSelectionContainer>
        <Button
            $size="s"
            icon={<EditIcon style={{width: "24px"}}/>}
            $layer={$layer}
            onClick={(e) => handleBeginSelecting(e, "start")}
            $color={selecting === "start" ? "primary" : undefined}
        >
            {(selecting === "start")
                ? "Výběr..."
                : (startSegmentID && startTime)
                ? timeToFormatedString(startTime)
                : "Zvolit začátek"}
        </Button>
        <span className="separator">–</span>
        <Button
            $size="s"
            icon={<EditIcon style={{width: "24px"}}/>}
            $layer={$layer}
            onClick={(e) => handleBeginSelecting(e, "end")}
            $color={selecting === "end" ? "primary" : undefined}
        >
            {(selecting === "end") 
                ? "Výběr..."
                : (endSegmentID && endTime)
                ? timeToFormatedString(endTime)
                : "Zvolit konec"}
        </Button>
    </StartEndSelectionContainer>
    )
}

export default StartEndSelection
