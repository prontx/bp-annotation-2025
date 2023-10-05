import styled from "styled-components";
import { clickableBaseStyles } from "../../../../style/clickableBaseStyles";

export const TextButton = styled.button`
    ${clickableBaseStyles}
    
    background-color: ${({theme}) => theme.gray80};
    color: ${({theme}) => theme.textSecondary};
    padding: 4px 8px;
    font-size: 1rem;

    &:hover, &:focus {
        background-color: ${({theme}) => theme.gray80Hover};
        color: ${({theme}) => theme.textPrimary};
    }

    &:active {
        background-color: ${({theme}) => theme.gray70};
        color: ${({theme}) => theme.textP};
    }
`