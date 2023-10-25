import { FC } from "react";

import { Menu, MenuItem } from "@reach/menu-button";
import { MenuPopover } from "../../basic/DropdownSelection/style/MenuPopover"
import { MenuButton } from "../../basic/DropdownSelection/style/MenuButton"
import { MenuItems } from "../../basic/DropdownSelection/style/MenuItems"
// import { positionMatchWidth } from "@reach/popover";

import styled from "styled-components";
import Layer from "../../../style/Layer"

const MenuBarContainer = styled.div<Layer>`
    display: grid;
    grid-template-areas:
        "logo title"
        "logo menuItems";
    grid-template-columns: auto 1fr;
    gap: 0 16px;
    padding: 8px 16px;
    background: ${({theme, layer}) => theme.layers[layer].background};

    img {
        grid-area: logo;
        height: 48px;
        margin: auto 0;
    }

    h1 {
        font-size: 14px;
        font-weight: normal;
        margin-left: 8px;
    }
`

const MenuItemsContainer = styled.div`
    display: flex;
    gap: 8px;

    & [data-reach-menu-popover] {
        z-index: 999;
    }
`

const MenuBar : FC<React.HTMLAttributes<HTMLDivElement> & Layer> = ({layer, ...props}) => {
    return (
        <MenuBarContainer layer={layer} {...props}>
            <img src="/src/assets/logo-spokendata-inverse.png" alt="SpokenData" />
            <h1>ATCO Lorem Ipsum Dolor 42</h1>
            <MenuItemsContainer>
                <Menu>
                    <MenuButton layer={layer}>File</MenuButton>
                    <MenuPopover layer={layer+1}>
                        <MenuItems layer={layer+1}>
                            <MenuItem onSelect={() => {}}>Undo</MenuItem>
                            <MenuItem onSelect={() => {}}>Redo</MenuItem>
                        </MenuItems>
                        <MenuItems layer={layer+1}>
                            <MenuItem onSelect={() => {}}>Auto Save</MenuItem>
                            <MenuItem onSelect={() => {}}>Save</MenuItem>
                            <MenuItem onSelect={() => {}}>Export</MenuItem>
                        </MenuItems>
                        <MenuItems layer={layer+1}>
                            <MenuItem onSelect={() => {}}>Close as DONE</MenuItem>
                            <MenuItem onSelect={() => {}}>Close as REFUSED</MenuItem>
                        </MenuItems>
                        <MenuItems layer={layer+1}>
                            <MenuItem onSelect={() => {}}>Shortcuts</MenuItem>
                        </MenuItems>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuButton layer={layer}>Playback</MenuButton>
                    <MenuPopover layer={layer+1}>
                        <MenuItems layer={layer+1}>
                            <MenuItem onSelect={() => {}}>Pre-play [s]</MenuItem>
                            <MenuItem onSelect={() => {}}>Time Shift [s]</MenuItem>
                        </MenuItems>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuButton layer={layer}>View</MenuButton>
                    <MenuPopover layer={layer+1}>
                        <MenuItems layer={layer+1}>
                            <MenuItem onSelect={() => {}}>Job Details</MenuItem>
                            <MenuItem onSelect={() => {}}>Speaker Labels</MenuItem>
                            <MenuItem onSelect={() => {}}>Sorted Waypoint-Callsign pairs</MenuItem>
                        </MenuItems>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuButton layer={layer}>Help</MenuButton>
                    <MenuPopover layer={layer+1}>
                        <MenuItems layer={layer+1}>
                            <MenuItem onSelect={() => {}}>Cheat Sheet</MenuItem>
                            <MenuItem onSelect={() => {}}>Annotation Manual</MenuItem>
                            <MenuItem onSelect={() => {}}>Some Other Manual</MenuItem>
                        </MenuItems>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuButton layer={layer}>Open in old editor</MenuButton>
                </Menu>
            </MenuItemsContainer>
        </MenuBarContainer>
    );
}

export default MenuBar;
