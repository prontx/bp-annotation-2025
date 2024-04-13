import { FC, HTMLAttributes } from "react"

// components
import Tag from "./Tag"
import TagSelection from "../../../components/TagSelection/TagSelection"

// style
import styled from "styled-components"

// types
import Layer from "../../../types/Layer"
import { GroupTag } from "../../transcript/types/Tag"


interface TagSetProps extends Layer, HTMLAttributes<HTMLDivElement> {
    tags: GroupTag[],
    editable?: boolean,
    addHandler?: (tag: string[]) => void,
    deleteHandler?: (i: number, tag: string) => void,
}

const TagSetLayout = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const TagSet: FC<TagSetProps> = ({tags, editable, $layer, addHandler, deleteHandler, ...props}) => {
    return (
        <TagSetLayout {...props}>
            {tags.length !== 0 && tags.map((tag, i) =>
                <Tag
                    key={tag.name}
                    $layer={$layer}
                    tag={tag}
                    deleteCallback={deleteHandler ? (tag: string) => deleteHandler(i, tag) : undefined}
                />
            )}
            {(editable && addHandler) && <TagSelection $layer={$layer} onSelection={addHandler} />}
        </TagSetLayout>
    )
}

export default TagSet
