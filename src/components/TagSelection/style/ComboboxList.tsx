import { clickableBaseStyles } from "../../../style/clickableBaseStyles";
import styled from "styled-components";
import Layer from "../../../types/Layer";
import { ComboboxList as BaseComboboxList } from "@reach/combobox";


export const ComboboxList = styled(BaseComboboxList)<Layer>`
    background-color: transparent;
    border: none;
    
    [data-reach-combobox-option] {
        ${clickableBaseStyles}

        background-color: ${({theme, $layer}) => theme.layers[$layer].background};
        color: ${({theme}) => theme.textSecondary};
        padding: 2px 4px;
        font-size: 1rem;
        display: flex;
        align-items: center;

        &[data-highlighted], &:hover {
            background-color: ${({theme, $layer}) => theme.layers[$layer].active};
            color: ${({theme}) => theme.textPrimary};
        }
    }
`
