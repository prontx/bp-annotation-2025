import { FC, useState } from "react"

// import { MenuList, MenuLink } from "@reach/menu-button";
import { Menu, MenuItem, MenuPopover } from "@reach/menu-button";
import { positionMatchWidth } from "@reach/popover";
import { MenuButton } from "./style/MenuButton";
import { MenuItems } from "./style/MenuItems";
import "@reach/menu-button/styles.css";

interface DropdownProps extends React.HTMLAttributes<typeof Menu> {
    variant: "text" | "icon" | "menu",
    onSelection: (value: number) => void,
    initialState: number,
    options: number[]
}

const Button: FC<DropdownProps> = ({variant, onSelection, initialState, options, ...props}) => {
    const [ value, setValue ] = useState(initialState)

    const handleSelect = (newValue: number) => {
        setValue(newValue)
        onSelection(newValue)
    }

    return (
        <Menu {...props}>
            <MenuButton>{value+"x"}<span className="dropdownArrow" aria-hidden>▾</span></MenuButton>
            <MenuPopover position={positionMatchWidth}>
                <MenuItems>
                    {options.map((option) => (
                        option !== value
                            ? <MenuItem key={option} onSelect={() => handleSelect(option)}>{option+"x"}</MenuItem>
                            : null
                    ))}
                </MenuItems>
            </MenuPopover>
        </Menu>
    )
    // switch (variant) {
    //     case "text":
    //         // TODO
    //         break;
        
    //     case "icon":
    //         // TODO
    //         break;
            
    //     case "menu":
    //         // TODO
    //         break;
    // }
}

export default Button
