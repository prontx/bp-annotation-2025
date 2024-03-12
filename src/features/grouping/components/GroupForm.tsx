import { FC, FormEvent, useState } from "react";

// components
import Button from "../../../components/Button/Button";

// style
import styled from "styled-components";

// redux
import { useAppDispatch } from "../../../redux/hooks";
import { createGroup } from "../redux/groupingSlice";

// types
import Layer from "../../../types/Layer";
import { RootState } from "../../../redux/store";


interface GroupFormProps extends Layer, React.HTMLAttributes<HTMLFormElement> {
    groupID?: string,
    closeFn: () => void,
}

const GroupFormContainer = styled.form<Layer>`
    border: 2px solid ${({theme, layer}) => theme.layers[layer+1].background};
    border-radius: 4px;

    & .body {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 4px 8px;
    }

    & .error {
        font-size: 14px;
        color: red;
        font-weight: 600;
    }
`

const GroupTitleInput = styled.input<Layer>`
    width: 100%;
    padding: 4px 8px;
    font-size: 1rem;
    font-weight: 600;
    color: ${({theme}) => theme.textSecondary};
    margin-right: auto;
    background: ${({theme, layer}) => theme.layers[layer].background};
    border-radius: 2px;
    border: 2px solid ${({theme, layer}) => theme.layers[layer].active};
    
    &:hover {
        background: ${({theme, layer}) => theme.layers[layer].hover};
    }
    
    &:active, &:focus {
        background: ${({theme, layer}) => theme.layers[layer].active};
    }
`

const GroupFormActions = styled.div`
    display: flex;
    gap: 8px;
    margin: 4px 8px;

    :first-child {
        margin-left: auto;
    }
`

const GroupForm: FC<GroupFormProps> = ({layer, groupID, closeFn, ...props}) => {
    const dispatch = useAppDispatch()
    const [title, setTitle] = useState("")
    const [error, setError] = useState("")
    const [startSegmentID, setStartSegmentID] = useState("")
    const [endSegmentID, setEndSegmentID] = useState("")
    const [tags, setTags] = useState<string[]>([])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!(title && startSegmentID && endSegmentID && tags.length > 0)){
            setError("Všechna pole jsou povinná!")
            return
        }

        dispatch(createGroup({
            title: title,
            startSegmentID: startSegmentID,
            endSegmentID: endSegmentID,
            tags: tags,
        }))
        closeFn()
    }

    return (
        <GroupFormContainer layer={layer} onSubmit={handleSubmit} {...props}>
            <GroupTitleInput
                layer={layer+1}
                type="text"
                value={title}
                placeholder="Zadat název"
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className="body">
                {/* TODO: time range selection */}
                <p>from - to</p>
                {/* TODO: tag selection */}
                <p>| tag A | tag B | |</p>
                {error && <p className="error">{error}</p>}
                <GroupFormActions>
                    <Button variant="text" layer={layer+1} type="submit">Vytvořit</Button>
                    {/* FIXME: cancel button color: 'danger' */}
                    <Button variant="text" layer={layer+1} onClick={closeFn}>Zrušit</Button>
                </GroupFormActions>
            </div>
        </GroupFormContainer>
    )
}

export default GroupForm
