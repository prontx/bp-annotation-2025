import { ComboboxInput as BaseComboboxInput } from "@reach/combobox"
import styled, { css } from "styled-components"
import { editableBaseStyles } from "../../../style/editableBaseStyles"
import Layer from "../../../types/Layer"


export const ComboboxInput = styled(BaseComboboxInput)<Layer>` ${({theme, $layer}) => css`
    ${editableBaseStyles}
    background: ${theme.layers[$layer].background};
    color: ${theme.textSecondary};
    width: 100%;
    padding: 4px 8px;
    font-size: 1rem;
    outline: none;
    
    &:hover {
        background: ${theme.layers[$layer].hover};
    }
    
    &:active, &:focus {
        border-color: ${theme.layers[$layer]["primary"].active};
        background: ${theme.layers[$layer].active};
    }
`}`
