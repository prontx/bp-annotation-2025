import { FC } from "react"

// components
import NamedContainer from "../../../components/NamedContainer"
import SpeakerTag from "../../../components/SpeakerItem"

// redux
import { useSelector } from "react-redux"
import { selectSpeakers } from "../redux/jobSlice"

// types
import Layer from "../../../types/Layer"
import styled from "styled-components"


const SpeakerListBody = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

const SpeakerList: FC<Layer> = ({$layer}) => {
    const speakers = useSelector(selectSpeakers)

    return (
        <NamedContainer name="Mluvčí" $layer={$layer} closeCallback={() => {/*FIXME*/}}>
            <SpeakerListBody className="body">
                {speakers.map(speaker => (
                    <SpeakerTag key={speaker.id} color={speaker.color} speakerID={speaker.id}>
                        {speaker.label}
                    </SpeakerTag>
                ))}
            </SpeakerListBody>
        </NamedContainer>
    )
}

export default SpeakerList
