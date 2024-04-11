// @ts-ignore
import { black, white, blackHover, whiteHover, gray, grayHover, red, redHover, cyan, cyanHover} from "@carbon/colors"


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
            neutral: {
                background: gray[100],
                hover: grayHover[100],
                active: gray[90],
            },
            primary: {
                background: cyan[100],
                hover: cyanHover[100],
                active: cyan[90],
            },
            danger: {
                background: red[100],
                hover: redHover[100],
                active: red[90],
            },
        },{
            background: gray[90],
            hover: grayHover[90],
            active: gray[80],
            neutral: {
                background: gray[90],
                hover: grayHover[90],
                active: gray[80],
            },
            primary: {
                background: cyan[90],
                hover: cyanHover[90],
                active: cyan[80],
            },
            danger: {
                background: red[90],
                hover: redHover[90],
                active: red[80],
            },
        },{
            background: gray[80],
            hover: grayHover[80],
            active: gray[70],
            neutral: {
                background: gray[80],
                hover: grayHover[80],
                active: gray[70],
            },
            primary: {
                background: cyan[80],
                hover: cyanHover[80],
                active: cyan[70],
            },
            danger: {
                background: red[80],
                hover: redHover[80],
                active: red[70],
            },
        },{
            background: gray[70],
            hover: grayHover[70],
            active: gray[60],
            neutral: {
                background: gray[70],
                hover: grayHover[70],
                active: gray[60],
            },
            primary: {
                background: cyan[70],
                hover: cyanHover[70],
                active: cyan[60],
            },
            danger: {
                background: red[70],
                hover: redHover[70],
                active: red[60],
            },
        },{
            background: gray[60],
            hover: grayHover[60],
            active: gray[50],
            neutral: {
                background: gray[60],
                hover: grayHover[60],
                active: gray[50],
            },
            primary: {
                background: cyan[60],
                hover: cyanHover[60],
                active: cyan[50],
            },
            danger: {
                background: red[60],
                hover: redHover[60],
                active: red[50],
            },
        },{
            background: gray[50],
            hover: grayHover[50],
            active: gray[40],
            neutral: {
                background: gray[50],
                hover: grayHover[50],
                active: gray[40],
            },
            primary: {
                background: cyan[50],
                hover: cyanHover[50],
                active: cyan[40],
            },
            danger: {
                background: red[50],
                hover: redHover[50],
                active: red[40],
            },
        },{
            background: gray[40],
            hover: grayHover[40],
            active: gray[30],
            neutral: {
                background: gray[40],
                hover: grayHover[40],
                active: gray[30],
            },
            primary: {
                background: cyan[40],
                hover: cyanHover[40],
                active: cyan[30],
            },
            danger: {
                background: red[40],
                hover: redHover[40],
                active: red[30],
            },
        },{
            background: gray[30],
            hover: grayHover[30],
            active: gray[20],
            neutral: {
                background: gray[30],
                hover: grayHover[30],
                active: gray[20],
            },
            primary: {
                background: cyan[30],
                hover: cyanHover[30],
                active: cyan[20],
            },
            danger: {
                background: red[30],
                hover: redHover[30],
                active: red[20],
            },
        },{
            background: gray[20],
            hover: grayHover[20],
            active: gray[10],
            neutral: {
                background: gray[20],
                hover: grayHover[20],
                active: gray[10],
            },
            primary: {
                background: cyan[20],
                hover: cyanHover[20],
                active: cyan[10],
            },
            danger: {
                background: red[20],
                hover: redHover[20],
                active: red[10],
            },
        },{
            background: gray[10],
            hover: grayHover[10],
            active: white,
            neutral: {
                background: gray[10],
                hover: grayHover[10],
                active: white,
            },
            primary: {
                background: cyan[10],
                hover: cyanHover[10],
                active: white,
            },
            danger: {
                background: red[10],
                hover: redHover[10],
                active: white,
            },
        },
    ],

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