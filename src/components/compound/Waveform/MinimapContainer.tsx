import styled from "styled-components";

const MinimapContainer = styled.div`
    background: ${({theme}) => theme.gray90};
    margin-bottom: 16px;
    
    #minimap {
        padding: 0 4px;
        border-radius: 4px;
        background: ${({theme}) => theme.gray80};
        height: 20px;
    }

    ::part(region) {
        background-color: ${({theme}) => theme.gray30}55 !important;
        position: absolute;
        box-shadow: none;

        &::before {
            content: "";
            position: absolute;
            box-sizing: border-box;
            pointer-events: none;
            width: 100%;
            height: 100%;
            border-radius: 2px;
            border-left: 2px solid ${({theme}) => theme.gray30};
            border-right: 2px solid ${({theme}) => theme.gray30};
            z-index: 4;
        }
    }
`

export default MinimapContainer
