import { FC, useState } from "react"

// components
import Button from "../../../components/Button/Button"
import GroupForm from "./GroupForm"
import AddIcon from '@mui/icons-material/Add';

// style
import styled from "styled-components"

// types
import Layer from "../../../types/Layer"


const StyledHeader = styled.div<Layer>`
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid ${({theme, $layer}) => theme.layers[$layer].active};
    padding: 8px;
`

const GroupListHeader: FC<Layer> = ({$layer}) => {
    const [isEditing, setIsEditing] = useState(false)

    if (isEditing) {
        return (
            <StyledHeader $layer={$layer}>
                <GroupForm $layer={$layer} closeFn={() => setIsEditing(false)} />
            </StyledHeader>
        )
    } else {
        return (
            <StyledHeader $layer={$layer}>
                <Button
                    icon={<AddIcon />}
                    $layer={$layer+1}
                    style={{width: "100%", padding: "8px"}}
                    onClick={() => setIsEditing(true)}
                >
                Přidat obsahová metadata
                </Button>
            </StyledHeader>
        )
    }
}

export default GroupListHeader
