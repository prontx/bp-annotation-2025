import { ComboboxInput as BaseComboboxInput } from "@reach/combobox";

import styled from 'styled-components';
import { editableBaseStyles } from "../../../../style/editableBaseStyles";
import Layer from '../../../../style/Layer';


const ComboboxInput = styled(BaseComboboxInput)<Layer>`
    ${editableBaseStyles}
    width: 100%;
    min-height: 24px;
    height: 28px;
    padding: 4px 0;
    font-size: 1rem;
    margin: 0 4px;
    background: ${({theme, layer}) => theme.layers[layer].background};
    color: ${({theme}) => theme.textPrimary};

    &:active, &:focus {
        outline: none;
    }
`

export default ComboboxInput
