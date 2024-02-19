import { ComboboxPopover as BaseComboboxPopover } from "@reach/combobox";

import styled from 'styled-components';

import Layer from '../../../../style/Layer';

const ComboboxPopover = styled(BaseComboboxPopover)<Layer>`
    position: absolute;
    left: 0;
    width: 100%;
    bottom: 0;
    transform: translateY(100%);
    max-height: 300px;
    overflow-y: scroll;
    border-radius: 4px;
    background: ${({theme, layer}) => theme.layers[layer].background} !important;
    border: 1px solid ${({theme, layer}) => theme.layers[layer].active};
    box-shadow: 0 0 4px 0 ${({theme}) => theme.gray100};
    z-index: 999;
`
// TODO: fix: popovers don't scroll if there are too many items to fit on screen, screen overflows and whole screen scrolls
// TODO: fix: show popover above combobox if there is not enough space below

export default ComboboxPopover
