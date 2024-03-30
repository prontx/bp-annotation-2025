import { FC, useState } from "react"

// components
import { Menu, MenuItem } from "@reach/menu-button";
import { positionMatchWidth } from "@reach/popover";

// styles
import { MenuPopover } from "./style/MenuPopover";
import { MenuButton } from "./style/MenuButton";
import { MenuItems } from "./style/MenuItems";
import "@reach/menu-button/styles.css";

// types
import Layer from "../../types/Layer";

interface DropdownSelectionProps extends React.HTMLAttributes<typeof Menu>, Layer {
    variant: "speed" | "speaker",
    onSelection: (value: number) => void,
    initialState: number,
    options: number[]
}

const DropdownSelection: FC<DropdownSelectionProps> = ({$layer, onSelection, options, ...props}) => {
    const [ value, setValue ] = useState(props.initialState)
    const [ choices, setChoices ] = useState(options.filter(option => option !== value))

    const handleSelect = (newValue: number) => {
        setChoices([...options.filter(option => option !== newValue)])
        setValue(newValue)
        onSelection(newValue)
    }

    if (props.variant === "speed") {
        return (
            <Menu {...props}>
                <MenuButton $layer={$layer}>{value+"x"}<span className="dropdownArrow" aria-hidden>▾</span></MenuButton>
                <MenuPopover $layer={$layer} position={positionMatchWidth}>
                    <MenuItems $layer={$layer}>
                        {choices.map((choice) => <MenuItem key={choice} onSelect={() => handleSelect(choice)}>{choice+"x"}</MenuItem>)}
                    </MenuItems>
                </MenuPopover>
            </Menu>
        )
    } else if (props.variant === "speaker") {
        return (
            <Menu {...props}>
                <MenuButton $layer={$layer} className="speaker">{value}<span className="dropdownArrow" aria-hidden>▾</span></MenuButton>
                <MenuPopover $layer={$layer} position={positionMatchWidth}>
                    <MenuItems $layer={$layer}>
                        {choices.map((choice) => (
                            <MenuItem key={choice}
                                onSelect={() => handleSelect(choice)}
                                className="speaker">{choice}</MenuItem>
                        ))}
                    </MenuItems>
                </MenuPopover>
            </Menu>
        )
    } else {
        return null
    }
}

export default DropdownSelection
