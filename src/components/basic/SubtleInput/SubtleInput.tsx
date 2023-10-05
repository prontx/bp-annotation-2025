import styled from "styled-components";
import { editableBaseStyles } from "../../../style/editableBaseStyles";

const SubtleInput = styled.input`
    ${editableBaseStyles}
    background: transparent;
    font-size: 1rem;
    color: currentColor;
    padding: 2px 4px;
    display: inline;
    width: 80px;
    
    &:hover, &:focus {
        outline: 2px solid ${({theme}) => theme.gray90Hover};
        color: ${({theme}) => theme.textPrimary};
    }

    &:focus {
        outline: 2px solid ${({theme}) => theme.gray80};
    }
`

export default SubtleInput;