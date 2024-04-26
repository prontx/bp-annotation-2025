import { FC } from "react"

// components
import NamedContainer from "../../../components/NamedContainer"
import EditableSpeaker from "./EditableSpeaker"

// style
import styled from "styled-components"

// redux
import { useSelector } from "react-redux"
import { selectSpeakers } from "../redux/transcriptSlice"

// types
import Layer from "../../../types/Layer"


const SpeakerListBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

const SpeakerList: FC<Layer> = ({$layer}) => {
    const speakers = useSelector(selectSpeakers)

    return (
        <NamedContainer name="Mluvčí" $layer={$layer}>
            <SpeakerListBody className="body">
                {speakers.map(speaker => <EditableSpeaker $layer={$layer} speaker={speaker} />)}
            </SpeakerListBody>
        </NamedContainer>
    )
}

export default SpeakerList
