import { FC } from "react";

import { Menu, MenuItem } from "@reach/menu-button";
import { MenuPopover } from "../../basic/DropdownSelection/style/MenuPopover"
import { MenuButton } from "../../basic/DropdownSelection/style/MenuButton"
import { MenuItems } from "../../basic/DropdownSelection/style/MenuItems"
// import { positionMatchWidth } from "@reach/popover";

import styled from "styled-components";

const MenuBarContainer = styled.div`
    display: grid;
    grid-template-areas:
        "logo title"
        "logo menuItems";
    grid-template-columns: auto 1fr;
    gap: 0 16px;
    padding: 8px 16px;
    background: ${({theme}) => theme.gray100};

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
    
    /* & > * {
        padding: 2px 8px;
        color: ${({theme}) => theme.textPrimary};
        border-radius: 4px;
        cursor: pointer;
    }

    & > *:hover {
        background-color: ${({theme}) => theme.gray100Hover};
    } */

    & [data-reach-menu-popover] {
        z-index: 999;
    }
`

const MenuBar : FC = () => {
    return (
        <MenuBarContainer>
            <img src="/src/assets/logo-spokendata-inverse.png" alt="SpokenData" />
            <h1>ATCO Lorem Ipsum Dolor 42</h1>
            <MenuItemsContainer>
                <Menu>
                    <MenuButton>File</MenuButton>
                    <MenuPopover>
                        <MenuItems>
                            <MenuItem onSelect={() => {}}>Undo</MenuItem>
                            <MenuItem onSelect={() => {}}>Redo</MenuItem>
                        </MenuItems>
                        <MenuItems>
                            <MenuItem onSelect={() => {}}>Auto Save</MenuItem>
                            <MenuItem onSelect={() => {}}>Save</MenuItem>
                            <MenuItem onSelect={() => {}}>Export</MenuItem>
                        </MenuItems>
                        <MenuItems>
                            <MenuItem onSelect={() => {}}>Close as DONE</MenuItem>
                            <MenuItem onSelect={() => {}}>Close as REFUSED</MenuItem>
                        </MenuItems>
                        <MenuItems>
                            <MenuItem onSelect={() => {}}>Shortcuts</MenuItem>
                        </MenuItems>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuButton>Playback</MenuButton>
                    <MenuPopover>
                        <MenuItems>
                            <MenuItem onSelect={() => {}}>Pre-play [s]</MenuItem>
                            <MenuItem onSelect={() => {}}>Time Shift [s]</MenuItem>
                        </MenuItems>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuButton>View</MenuButton>
                    <MenuPopover>
                        <MenuItems>
                            <MenuItem onSelect={() => {}}>Job Details</MenuItem>
                            <MenuItem onSelect={() => {}}>Speaker Labels</MenuItem>
                            <MenuItem onSelect={() => {}}>Sorted Waypoint-Callsign pairs</MenuItem>
                        </MenuItems>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuButton>Help</MenuButton>
                    <MenuPopover>
                        <MenuItems>
                            <MenuItem onSelect={() => {}}>Cheat Sheet</MenuItem>
                            <MenuItem onSelect={() => {}}>Annotation Manual</MenuItem>
                            <MenuItem onSelect={() => {}}>Some Other Manual</MenuItem>
                        </MenuItems>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuButton>Open in old editor</MenuButton>
                </Menu>
            </MenuItemsContainer>
        </MenuBarContainer>
    );
}

export default MenuBar;
