import { FC, FormEvent, MouseEventHandler, useEffect, useState } from "react";

// components
import Button from "../../../components/Button";
import TagSelection from "../../../components/TagSelection/TagSelection";
import Tag from "../../../components/Tag";
import StartEndSelection from "./StartEndSelection";
import AddIcon from '@mui/icons-material/Add';

// style
import styled, { css } from "styled-components";

// redux
import { useAppDispatch } from "../../../redux/hooks";
import { createOrUpdateGroup, resetEditing, resetSelecting, selectGroupByID, setStartEndParentSegmentIDs } from "../redux/groupingSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

// types
import Layer from "../../../types/Layer";


interface GroupFormProps extends Layer, React.HTMLAttributes<HTMLFormElement> {
    groupID?: string,
    parentID?: string,
    parentTags?: string[],
    submitCallback?: () => void,
}

const GroupFormContainer = styled.form<Layer>`
    border: 2px solid ${({theme, $layer}) => theme.layers[$layer+1].background};
    border-radius: 4px;

    & .body {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 8px;
    }

    & .error {
        font-size: ${({theme}) => theme.text_s};
        color: ${({theme}) => theme.textDanger};
        font-weight: 600;
    }
`

const GroupTitleInput = styled.input<Layer>` ${({theme, $layer}) => css`
    width: 100%;
    padding: 2px 8px;
    font-size: ${theme.heading_m};
    font-weight: 600;
    color: ${theme.textSecondary};
    margin-right: auto;
    background: ${theme.layers[$layer].background};
    border-radius: 2px;
    border: none;
    outline: 2px solid ${theme.layers[$layer].active};
    
    &:hover {
        background: ${theme.layers[$layer].hover};
    }
    
    &:active, &:focus {
        background: ${theme.layers[$layer].active};
        outline-color: ${theme.layers[$layer]["primary"].active};
    }
`}`

const GroupFormActions = styled.div`
    display: flex;
    gap: 8px;
    margin: 4px 8px;

    :first-child {
        margin-left: auto;
    }
`

const GroupForm: FC<GroupFormProps> = ({$layer, groupID, parentID, parentTags, submitCallback, ...props}) => {
    const dispatch = useAppDispatch()
    const [isEditing, setIsEditing] = useState(false)
    const [title, setTitle] = useState("")
    const [error, setError] = useState("")
    const [startSegmentID, setStartSegmentID] = useState("")
    const [endSegmentID, setEndSegmentID] = useState("")
    const [tags, setTags] = useState<string[]>([])
    const group = useSelector((state: RootState) => selectGroupByID(state, groupID))
    
    useEffect(() => { // load existing data if editing, skip if creating
        if (!group)
            return

        setIsEditing(true)
        setTitle(group.title)
        setStartSegmentID(group.startSegmentID)
        setEndSegmentID(group.endSegmentID)
        setTags(group.tags)
    }, [group])

    const resetState = () => {
        setIsEditing(false)
        setTitle("")
        setError("")
        setStartSegmentID("")
        setEndSegmentID("")
        setTags([])
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!(title && startSegmentID && endSegmentID && tags.length > 0)){
            setError("Všechna pole jsou povinná!")
            return
        }

        dispatch(createOrUpdateGroup({
            id: groupID,
            title: title,
            startSegmentID: startSegmentID,
            endSegmentID: endSegmentID,
            parentID: parentID,
            tags: tags,
        }))

        dispatch(resetEditing())
        resetState()

        if (submitCallback)
            submitCallback()
    }

    const handleTagSelection = (newTags: string[]) => {
        let merged: string[] = newTags
        for (let i = 0; parentTags && i < parentTags.length; i++){
            if (i >= newTags.length || parentTags[i] !== newTags[i]){
                break
            }
            merged.shift()
        }
        setTags(merged)
    }

    const handleCancelation: MouseEventHandler<HTMLButtonElement> = (e) => {
        e.stopPropagation() // prevent form submission
        dispatch(resetSelecting())
        dispatch(resetEditing())
        resetState()
        if (submitCallback)
            submitCallback()
    }

    const handleEditingStart = () => {
        dispatch(setStartEndParentSegmentIDs(parentID))
        setIsEditing(true)
    }

    if (!isEditing) {
        return (
            <Button
                icon={<AddIcon />}
                $layer={$layer+1}
                style={{width: "100%", padding: "8px"}}
                onClick={handleEditingStart}
            >
            Přidat obsahová metadata
            </Button>
        )
    }

    return (
        <GroupFormContainer $layer={$layer} onSubmit={handleSubmit} {...props}>
            <GroupTitleInput
                $layer={$layer+1}
                type="text"
                value={title}
                placeholder="Zadat název"
                onChange={(e) => setTitle(e.target.value)}
            />
            <div className="body">
                <StartEndSelection
                    $layer={$layer+1}
                    startSegmentID={startSegmentID}
                    setStartSegmentID={setStartSegmentID}
                    endSegmentID={endSegmentID}
                    setEndSegmentID={setEndSegmentID}
                />
                {tags.length > 0
                    ? <Tag tags={tags} $layer={$layer+1} deleteCallback={() => setTags(tags.slice(0, -1))} />
                    : <TagSelection $layer={$layer} onSelection={handleTagSelection} />}
                {error && <p className="error">{error}</p>}
                <GroupFormActions>
                    <Button $size="l" $layer={$layer+1} type="submit">{groupID ? "Uložit" : "Vytvořit"}</Button>
                    <Button $size="l" $color="danger" $layer={$layer+1} onClick={handleCancelation}>Zrušit</Button>
                </GroupFormActions>
            </div>
        </GroupFormContainer>
    )
}

export default GroupForm
