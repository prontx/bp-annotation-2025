import { useState } from "react"

// components
import { Menu, MenuItem } from "@reach/menu-button";
import SpeakerItem from "../SpeakerItem";

// styles
import { MenuPopover } from "./style/MenuPopover";
import { MenuButton } from "./style/MenuButton";
import { MenuItems } from "./style/MenuItems";
import "@reach/menu-button/styles.css";

// types
import Layer from "../../types/Layer";
import type { SpeakerTag } from "../../features/transcript/types/Tag";


interface DropdownSelectionProps<T> extends React.HTMLAttributes<typeof Menu>, Layer {
    onSelection: (value: T) => void,
    initialState?: T,
    options: T[],
}

const DropdownSelection = <T extends number|SpeakerTag,>({$layer, onSelection, options, ...props}: DropdownSelectionProps<T>) => {
    const [ value, setValue ] = useState<T|undefined>(props.initialState)
    const [ choices, setChoices ] = useState<T[]>(options.filter(option => {
        if (typeof(value) === "undefined"){
            return false
        }
        if (typeof(value) === "number" || typeof(option) === "number"){
            return option !== value
        }
        return value.id !== option.id
    }))

    const handleSelect = (newValue: T) => {
        setChoices([...options.filter(option => option !== newValue)])
        setValue(newValue)
        onSelection(newValue)
    }

    return (
        <Menu {...props}>
            <MenuButton $layer={$layer}>
                {(typeof(value) === "number")
                    ? value+"x"
                    : <SpeakerItem speakerID={value?.id || "?"} color={value?.color}>
                        {value?.label}
                    </SpeakerItem>
                }
                <span className="dropdownArrow" aria-hidden>▾</span>
            </MenuButton>
            <MenuPopover $layer={$layer}>
                <MenuItems $layer={$layer}>
                    {choices.map((choice) => (
                        <MenuItem key={(typeof(choice) === "number") ? choice : choice.id} onSelect={() => handleSelect(choice)}>
                            {(typeof(choice) === "number")
                                ? choice+"x"
                                : <SpeakerItem speakerID={choice?.id || "?"} color={choice?.color}>
                                    {choice?.label}
                                </SpeakerItem>
                            }
                        </MenuItem>
                    ))}
                </MenuItems>
            </MenuPopover>
        </Menu>
    )
}

export default DropdownSelection
