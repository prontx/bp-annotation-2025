import { FC } from "react";

// state management
import { useAppDispatch } from "../../../redux/hooks";
import { zoomIn, zoomOut } from "../../../redux/slices/playbackSlice";

// styles
import styled from "styled-components";
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import Layer from "../../../style/Layer";

// components
import Button from "../../basic/Button/Button";

/**
 * A container for the playback controls that positions them.
 */
const ZoomControlsContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;

    p {
        margin-right: 8px;
    }
`

const ZoomControls : FC<Layer> = ({layer}) => {
    const dispatch = useAppDispatch()

    // TODO: fix icons
    
    return (
        <ZoomControlsContainer>
            <p>Zoom:</p>
            <Button layer={layer} variant="icon" onClick={ () => dispatch(zoomIn()) }>
                <ZoomInRoundedIcon />
            </Button>
            <Button layer={layer} variant="icon" onClick={ () => dispatch(zoomOut()) }>
                <ZoomOutRoundedIcon />
            </Button>
        </ZoomControlsContainer>
    );
}

export default ZoomControls;