import { FC, useState } from "react"

import { Menu, MenuItem } from "@reach/menu-button";
import { positionMatchWidth } from "@reach/popover";
import { MenuPopover } from "./style/MenuPopover";
import { MenuButton } from "./style/MenuButton";
import { MenuItems } from "./style/MenuItems";
import "@reach/menu-button/styles.css";

interface DropdownSelectionProps extends React.HTMLAttributes<typeof Menu> {
    variant: "text" | "icon",
    onSelection: (value: number) => void,
    initialState: number,
    options: number[]
}

const DropdownSelection: FC<DropdownSelectionProps> = ({variant, onSelection, initialState, options, ...props}) => {
    const [ value, setValue ] = useState(initialState)
    const [ choices, setChoices ] = useState(options.filter(option => option !== value))

    const handleSelect = (newValue: number) => {
        setChoices([...choices.filter(option => option !== newValue), value].sort((a, b) => a - b))
        setValue(newValue)
        onSelection(newValue)
    }

    return (
        <Menu {...props}>
            <MenuButton>{value+"x"}<span className="dropdownArrow" aria-hidden>▾</span></MenuButton>
            <MenuPopover position={positionMatchWidth}>
                <MenuItems>
                    {choices.map((choice) => <MenuItem key={choice} onSelect={() => handleSelect(choice)}>{choice+"x"}</MenuItem>)}
                </MenuItems>
            </MenuPopover>
        </Menu>
    )
}

export default DropdownSelection
