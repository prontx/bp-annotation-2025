import { ComboboxList as BaseComboboxList } from "@reach/combobox";

import styled from 'styled-components';
import { clickableBaseStyles } from "../../../../style/clickableBaseStyles";

import Layer from '../../../../style/Layer';

const ComboboxList = styled(BaseComboboxList)<Layer>`
    border-radius: 4px;
    background: transparent;

    [data-reach-combobox-option] {
        ${clickableBaseStyles}
        background: ${({theme, layer}) => theme.layers[layer].background};
        margin: 4px;

        &:hover {
            background: ${({theme, layer}) => theme.layers[layer].hover};
        }

        &:active, &:focus, &[data-highlighted] {
            background: ${({theme, layer}) => theme.layers[layer].active};
        }

        [data-reach-combobox-option-text] {
            font-size: 1rem;
        }

        [data-suggested-value] {
            font-weight: normal;
        }

        [data-user-value] {
            font-weight: bold;
        }
    }
`
    
export default ComboboxList
