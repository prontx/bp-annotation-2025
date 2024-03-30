// @ts-ignore
import { black, white, blackHover, whiteHover, gray, grayHover, red, redHover} from "@carbon/colors"


export const theme = {
    white: white,
    whiteHover: whiteHover,
    
    black: black,
    blackHover: blackHover,

    gray10: gray[10],
    gray20: gray[20],
    gray30: gray[30],
    gray40: gray[40],
    gray50: gray[50],
    gray60: gray[60],
    gray70: gray[70],
    gray80: gray[80],
    gray90: gray[90],
    gray100: gray[100],

    grayHover10: grayHover[10],
    grayHover20: grayHover[20],
    grayHover30: grayHover[30],
    grayHover40: grayHover[40],
    grayHover50: grayHover[50],
    grayHover60: grayHover[60],
    grayHover70: grayHover[70],
    grayHover80: grayHover[80],
    grayHover90: grayHover[90],
    grayHover100: grayHover[100],

    red10: red[10],
    red20: red[20],
    red30: red[30],
    red40: red[40],
    red50: red[50],
    red60: red[60],
    red70: red[70],
    red80: red[80],
    red90: red[90],
    red100: red[100],

    redHover10: redHover[10],
    redHover20: redHover[20],
    redHover30: redHover[30],
    redHover40: redHover[40],
    redHover50: redHover[50],
    redHover60: redHover[60],
    redHover70: redHover[70],
    redHover80: redHover[80],
    redHover90: redHover[90],
    redHover100: redHover[100],

    textPrimary: gray[10],
    textSecondary: gray[30],
    textDanger: red[40],

    layers: [
        {
            background: gray[100],
            hover: grayHover[100],
            active: gray[90],
        },{
            background: gray[90],
            hover: grayHover[90],
            active: gray[80],
        },{
            background: gray[80],
            hover: grayHover[80],
            active: gray[70],
        },{
            background: gray[70],
            hover: grayHover[70],
            active: gray[60],
        },{
            background: gray[60],
            hover: grayHover[60],
            active: gray[50],
        },{
            background: gray[50],
            hover: grayHover[50],
            active: gray[40],
        },{
            background: gray[40],
            hover: grayHover[40],
            active: gray[30],
        },{
            background: gray[30],
            hover: grayHover[30],
            active: gray[20],
        },{
            background: gray[20],
            hover: grayHover[20],
            active: gray[10],
        },{
            background: gray[10],
            hover: grayHover[10],
            active: white,
        },
    ],

    speakerColors: ["#8FBA69", "#45BCCC", "#CA9FCA", "#E59C77", "#54BFA3", "#8DB0DE", "#E399A2", "#C5AC50"],

    labelColors: ["#00804F", "#697600", "#9C631B", "#AB555C", "#905D91", "#3673A5"],

    /* Text and heading sizes adopted from GOV.UK Design System
    * https://design-system.service.gov.uk/styles/type-scale/
    */
    text_xs: "14px",
    text_s: "16px",
    text_m: "19px",
    text_l: "24px",
    heading_s: "19px",
    heading_m: "24px",
    heading_l: "36px",
    heading_xl: "48px",
}