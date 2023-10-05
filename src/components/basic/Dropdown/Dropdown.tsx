import { FC } from "react"

// import { MenuList, MenuLink } from "@reach/menu-button";
import { Menu, MenuItem, MenuPopover } from "@reach/menu-button";
import { positionMatchWidth } from "@reach/popover";
import { MenuButton } from "./style/MenuButton";
import { MenuItems } from "./style/MenuItems";
import "@reach/menu-button/styles.css";

// q: what should DropdownProps extend?
// a: probably ButtonProps, use React.HTMLAttributes<HTMLButtonElement>

interface DropdownProps extends React.HTMLAttributes<typeof Menu> {
    variant: "text" | "icon" | "menu",
    selectedOption: string,
    options: string[]
}

const Button: FC<DropdownProps> = ({variant, selectedOption, options, ...props}) => {
    switch (variant) {
        case "text":
            return (
                <Menu {...props}>
                    <MenuButton>{selectedOption}<span className="dropdownArrow" aria-hidden>▾</span></MenuButton>
                    <MenuPopover position={positionMatchWidth}>
                        <MenuItems>
                            {options.map((option) => (
                                option !== selectedOption ? <MenuItem onSelect={() => {}}>{option}</MenuItem> : <></>
                                // TODO: change state onSelect
                            ))}
                        </MenuItems>
                    </MenuPopover>
                </Menu>
            )
        
        case "icon":
            // TODO
            break;
            
        case "menu":
            // TODO
            break;
    }
}

export default Button
