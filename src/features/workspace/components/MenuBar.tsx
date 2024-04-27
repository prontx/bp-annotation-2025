import { FC } from "react"

// components
import { Menu, MenuItem } from "@reach/menu-button"
import { MenuPopover } from "../../../components/Menu/MenuPopover"
import { MenuButton } from "../../../components/Menu/MenuButton"
import { MenuItems } from "../../../components/Menu/MenuItems"
import Button from "../../../components/Button"

// style
import styled from "styled-components"

// redux
import { useSelector } from "react-redux"
import { selectTitle } from "../redux/workspaceSlice"
import { useAppDispatch } from "../../../redux/hooks"
import { historyRedo, historyUndo } from "../redux/workspaceSlice"

// types
import Layer from "../../../types/Layer"


const MenuBarContainer = styled.nav<Layer>`
    display: grid;
    grid-template-areas:
        "logo title"
        "logo menuItems";
    grid-template-columns: auto 1fr;
    gap: 0 16px;
    background: ${({theme, $layer}) => theme.layers[$layer].background};

    img {
        grid-area: logo;
        height: 48px;
        margin: auto 0;
    }

    h1 {
        font-size: ${({theme}) => theme.text_s};
        font-weight: normal;
        margin-left: 8px;
    }

    button {
        font-weight: normal;
        font-size: 1rem;
        text-transform: none;
    }
`

const MenuItemsContainer = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;

    & [data-reach-menu-popover] {
        z-index: 999;
    }
`

const MenuBar : FC<React.HTMLAttributes<HTMLDivElement> & Layer> = ({$layer, ...props}) => {
    const title = useSelector(selectTitle)
    const dispatch = useAppDispatch()

    const handleSave = () => {
        // TODO
    }

    const handleNavigateToCatalogue = () => {
        const URL = "https://data.jamap.cz/cards/show-all"
        handleSave()
        window.location.href = URL
    }

    return (
        <MenuBarContainer $layer={$layer} {...props}>
            <img src="/src/assets/logo-spokendata-inverse.png" alt="SpokenData logo" />
            <h1>{title}</h1>
            <MenuItemsContainer>
                <Button $layer={$layer} onClick={handleNavigateToCatalogue}>Zpět do karty</Button>
                <Menu>
                    <MenuButton $layer={$layer}>Soubor</MenuButton>
                    <MenuPopover $layer={$layer+1}>
                        <MenuItems $layer={$layer+1}>
                            <MenuItem onSelect={handleSave}>Uložit</MenuItem> {/* Ctrl+S */}
                            <MenuItem onSelect={() => {/*TODO*/}}>Hotovo</MenuItem>
                        </MenuItems>
                    </MenuPopover>
                </Menu>
                <Menu>
                    <MenuButton $layer={$layer}>Úpravy</MenuButton>
                    <MenuPopover $layer={$layer+1}>
                        <MenuItems $layer={$layer+1}>
                            <MenuItem onSelect={() => dispatch(historyUndo())}>Zpět</MenuItem> {/* Ctrl+Z */}
                            <MenuItem onSelect={() => dispatch(historyRedo())}>Navrátit</MenuItem> {/* Ctrl+Shift+Z, Ctrl+Y */}
                        </MenuItems>
                    </MenuPopover>
                </Menu>
                <Button $layer={$layer} onClick={() => {/*TODO*/}}>Nastavení</Button>
                <Menu>
                    <MenuButton $layer={$layer}>Nápověda</MenuButton>
                    <MenuPopover $layer={$layer+1}>
                        <MenuItems $layer={$layer+1}>
                            <MenuItem onSelect={() => {/*TODO*/}}>Příručka pro anotaci</MenuItem>
                            <MenuItem onSelect={() => {/*TODO*/}}>Some Other Manual</MenuItem> {/* TODO: load from job */}
                        </MenuItems>
                    </MenuPopover>
                </Menu>
            </MenuItemsContainer>
        </MenuBarContainer>
    );
}

export default MenuBar;