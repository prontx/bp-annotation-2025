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
`

export default MinimapContainer
