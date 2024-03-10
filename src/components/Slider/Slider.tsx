import styled from "styled-components";

import {  Slider as BaseSlider } from "@reach/slider";
import "@reach/slider/styles.css";

const Slider = styled(BaseSlider)`
    width: 120px;
    height: 4px !important;
    cursor: pointer;

    [data-reach-slider-track] {
        background: ${({theme}) => theme.gray60};
        height: 4px;
    }
    
    [data-reach-slider-range] {
        background: ${({theme}) => theme.textSecondary};
    }
    
    [data-reach-slider-handle] {
        height: 16px;
        background: ${({theme}) => theme.textSecondary};
        filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.25));
        transition: filter 0.2s ease-in-out;

        &:active {
            filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.5));
        }
    }
`

export default Slider;
