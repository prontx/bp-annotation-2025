import styled from "styled-components";
import { clickableBaseStyles } from "../../../../style/clickableBaseStyles";

export const IconButton = styled.button`
    ${clickableBaseStyles}

    display: flex;
    padding: 4px 8px;

    background-color: ${({theme}) => theme.gray80};

    &:hover, &:focus {
        background-color: ${({theme}) => theme.gray80Hover};
    }

    &:active {
        background-color: ${({theme}) => theme.gray70};
    }

    & svg {
        fill: ${({theme}) => theme.textSecondary};
        stroke: ${({theme}) => theme.textSecondary};
        padding: 4px 8px;
        width: 1rem;
        height: 1rem;
        box-sizing: content-box;
    }

    &:active svg, &:hover svg, &:focus svg {
        fill: ${({theme}) => theme.textPrimary};
        stroke: ${({theme}) => theme.textPrimary};
    }
`