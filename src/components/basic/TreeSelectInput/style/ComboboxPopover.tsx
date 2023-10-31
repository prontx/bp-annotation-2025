import { ComboboxPopover as BaseComboboxPopover } from "@reach/combobox";

import styled from 'styled-components';

import Layer from '../../../../style/Layer';

const ComboboxPopover = styled(BaseComboboxPopover)<Layer>`
    border-radius: 4px;
    background: ${({theme, layer}) => theme.layers[layer].background};
    border: 1px solid ${({theme, layer}) => theme.layers[layer].active};
    box-shadow: 0 0 4px 0 ${({theme}) => theme.gray100};
`
// TODO: fix: popovers don't scroll if there are too many items to fit on screen, screen overflows and whole screen scrolls

export default ComboboxPopover
