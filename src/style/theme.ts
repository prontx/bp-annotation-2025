// Author: Jakub Dugovič
// 
// Acknowledgements:
// grayscale and hover colors taken from IBM Carbon Design System
// speaker and label color palettes created using Munsell Color System

const GRAY10  = "#f4f4f4";
const GRAY20  = "#e0e0e0";
const GRAY30  = "#c6c6c6";
const GRAY40  = "#a8a8a8";
const GRAY50  = "#8d8d8d";
const GRAY60  = "#6f6f6f";
const GRAY70  = "#525252";
const GRAY80  = "#393939";
const GRAY90  = "#262626";
const GRAY100 = "#161616";

const WHITEHOVER = "#e8e8e8";
const BLACKHOVER = "#212121";
const GRAY10HOVER = "#e8e8e8";
const GRAY20HOVER = "#d2d2d2";
const GRAY30HOVER = "#b5b5b5";
const GRAY40HOVER = "#999999";
const GRAY50HOVER = "#7a7a7a";
const GRAY60HOVER = "#5f5f5f";
const GRAY70HOVER = "#636363";
const GRAY80HOVER = "#484848";
const GRAY90HOVER = "#343434";
const GRAY100HOVER = "#292929";

export const theme = {
    white: "#ffffff",
    black: "#000000",
    
    gray10: GRAY10,
    gray20: GRAY20,
    gray30: GRAY30,
    gray40: GRAY40,
    gray50: GRAY50,
    gray60: GRAY60,
    gray70: GRAY70,
    gray80: GRAY80,
    gray90: GRAY90,
    gray100: GRAY100,
    
    whiteHover: WHITEHOVER,
    blackHover: BLACKHOVER,
    gray10Hover: GRAY10HOVER,
    gray20Hover: GRAY20HOVER,
    gray30Hover: GRAY30HOVER,
    gray40Hover: GRAY40HOVER,
    gray50Hover: GRAY50HOVER,
    gray60Hover: GRAY60HOVER,
    gray70Hover: GRAY70HOVER,
    gray80Hover: GRAY80HOVER,
    gray90Hover: GRAY90HOVER,
    gray100Hover: GRAY100HOVER,

    textPrimary: GRAY10,
    textSecondary: GRAY30,

    layers: [
        {
            background: GRAY100,
            hover: GRAY100HOVER,
            active: GRAY90
        },{
            background: GRAY90,
            hover: GRAY90HOVER,
            active: GRAY80
        },{
            background: GRAY80,
            hover: GRAY80HOVER,
            active: GRAY70
        },{
            background: GRAY70,
            hover: GRAY70HOVER,
            active: GRAY60
        },{
            background: GRAY60,
            hover: GRAY60HOVER,
            active: GRAY50
        }
    ],

    speakerColors: ["#8FBA69", "#45BCCC", "#CA9FCA", "#E59C77", "#54BFA3", "#8DB0DE", "#E399A2", "#C5AC50"],

    labelColors: ["#00804F", "#697600", "#9C631B", "#AB555C", "#905D91", "#3673A5"]
}