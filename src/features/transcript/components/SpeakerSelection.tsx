import { FC, useEffect, useState } from "react"

// components
import { Menu, MenuItem } from "@reach/menu-button";
import SpeakerItem from "../../../components/SpeakerItem";

// styles
import { MenuPopover } from "../../../components/Menu/MenuPopover";
import { MenuButton } from "../../../components/Menu/MenuButton";
import { MenuItems } from "../../../components/Menu/MenuItems";
import "@reach/menu-button/styles.css";

// redux
import { useSelector } from "react-redux";
import { selectSpeakerByID, selectSpeakers } from "../redux/transcriptSlice";

// types
import Layer from "../../../types/Layer";
import { SpeakerTag } from "../types/Tag";
import { RootState } from "../../../redux/store";


interface SpeakerSelectionProps extends React.HTMLAttributes<typeof Menu>, Layer {
    onSelection: (speakerID: string) => void,
    initialState?: string,
}

const SpeakerSelection: FC<SpeakerSelectionProps> = ({$layer, onSelection, initialState, ...props}) => {
    const [speakerID, setSpeakerID] = useState(initialState)
    const value = useSelector((state: RootState) => selectSpeakerByID(state, speakerID))
    const speakers = useSelector(selectSpeakers)
    const [choices, setChoices] = useState<SpeakerTag[]>([])

    useEffect(() => {
        setChoices([...speakers.filter(speaker => speaker.id !== speakerID && speaker.label)])
    }, [speakerID, speakers])
    
    const handleSelect = (newID: string) => {
        setSpeakerID(newID)
        onSelection(newID)
    }

    return (
        <Menu {...props}>
            <MenuButton $layer={$layer}>
                <SpeakerItem speakerID={value?.id || "?"} color={value?.color}>
                    {value?.label}
                </SpeakerItem>
                <span className="dropdownArrow" aria-hidden>▾</span>
            </MenuButton>
            <MenuPopover $layer={$layer}>
                <MenuItems $layer={$layer}>
                    {choices.map((choice) => (
                        <MenuItem key={choice.id} onSelect={() => handleSelect(choice.id)}>
                            <SpeakerItem speakerID={choice?.id || "?"} color={choice?.color}>
                                {choice?.label}
                            </SpeakerItem>
                        </MenuItem>
                    ))}
                </MenuItems>
            </MenuPopover>
        </Menu>
    )
}

export default SpeakerSelection
