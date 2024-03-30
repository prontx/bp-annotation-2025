import { FC } from "react";

// components
import Button from "../../../components/Button/Button";
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import Tooltip from "../../../components/Tooltip/Tooltip";

// styles
import styled from "styled-components";

// types
import type Layer from "../../../types/Layer";

interface SegmentActionsProps extends Layer, React.HTMLAttributes<HTMLDivElement> {
    deleteHandler: () => void, 
    mergeHandler: () => void 
}

const SegmentActionsLayout = styled.div<Layer>`
    display: flex;
    position: relative;
`

const SegmentActions: FC<SegmentActionsProps> = ({layer, deleteHandler, mergeHandler, ...props}) => {
    return (
        <SegmentActionsLayout layer={layer} {...props}>
            <Tooltip label="Merge down" layer={layer+1}>
                <Button layer={layer} onClick={mergeHandler}>
                    <KeyboardDoubleArrowDownRoundedIcon />
                </Button>
            </Tooltip>
            <Tooltip label="Delete segment" layer={layer+1}>
                <Button blended color="danger" layer={layer} onClick={deleteHandler}>
                    <DeleteOutlineRoundedIcon />
                </Button>
            </Tooltip>
        </SegmentActionsLayout>
    )
}

export default SegmentActions