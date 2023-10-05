import { FC } from "react"

interface IconProps extends React.SVGAttributes<SVGElement> {
    variant: "skipToStart" | "skipBackward" | "play" | "pause" | "skipForward" | "skipToEnd" | "volumeMute" | "volumeFull"
}

const Icon: FC<IconProps> = ({variant, ...props}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
            {(() => {
                switch (variant) {
                    case "play":
                        return <path d="M5 3L19 12L5 21V3Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>;
                    case "pause":
                        return <>
                            <path d="M10.519 4.27274H6.51904V20.2727H10.519V4.27274Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M18.519 4.27274H14.519V20.2727H18.519V4.27274Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </>;
                    case "skipBackward":
                        return <>
                            <path d="M19 20L9 12L19 4V20Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M5 19V5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </>;
                    case "skipForward":
                        return <>
                            <path d="M5 4L15 12L5 20V4Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19 5V19" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </>;
                    case "skipToStart":
                        return <>
                            <path d="M11 19L2 12L11 5V19Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M22 19L13 12L22 5V19Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </>;
                    case "skipToEnd":
                        return <>
                            <path d="M13 19L22 12L13 5V19Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2 19L11 12L2 5V19Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </>;
                    case "volumeMute":
                        return <path d="M13 5L8 9H4V15H8L13 19V5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>;
                    case "volumeFull":
                        return <>
                            <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M19.07 4.92999C20.9447 6.80527 21.9979 9.34835 21.9979 12C21.9979 14.6516 20.9447 17.1947 19.07 19.07M15.54 8.45999C16.4774 9.39763 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </>;
                }
            })()}
        </svg>
    )
}

export default Icon
