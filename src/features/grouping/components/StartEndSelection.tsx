import { FC, SyntheticEvent } from "react"

// components
import Button from "../../../components/Button"
import EditIcon from '@mui/icons-material/Edit';

// style
import styled from "styled-components"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { selectSelecting, beginSelecting, selectStartEndSegmentIDs } from "../redux/groupingSlice"
import { useSelector } from "react-redux"
import { selectSegmentEndByID, selectSegmentStartByID } from "../../transcript/redux/transcriptSlice"

// types
import Layer from "../../../types/Layer"
import { RootState } from "../../../redux/store"

// utils
import { timeToFormatedString } from "../../../utils/convertTimeAndFormatedString"


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

const StartEndSelection: FC<Layer> = ({$layer}) => {
    const dispatch = useAppDispatch()
    const selecting = useSelector(selectSelecting)
    const { startSegmentID, endSegmentID } = useSelector(selectStartEndSegmentIDs)
    const startTime = useSelector((state: RootState) => selectSegmentStartByID(state, startSegmentID))
    const endTime = useSelector((state: RootState) => selectSegmentEndByID(state, endSegmentID))

    const handleBeginSelecting = (e: SyntheticEvent|null, type: "start"|"end") => {
        if (e){
            e.preventDefault() // prevent group form submission
        }
        dispatch(beginSelecting(type))
    }

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
