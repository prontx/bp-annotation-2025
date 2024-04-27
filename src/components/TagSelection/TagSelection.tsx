import { FC, useState } from "react"

// components
import { Combobox } from "@reach/combobox"
import { ComboboxInput } from "./style/ComboboxInput"
import { ComboboxPopover } from "./style/ComboboxPopover"
import { ComboboxList } from "./style/ComboboxList"
import ComboboxOptionSet from "./components/ComboboxOptionSet"

// style
import "@reach/combobox/styles.css"

// redux
import { useSelector } from "react-redux"
import { selectGroupTags } from "../../features/workspace/redux/workspaceSlice"

// types
import Layer from "../../types/Layer"


interface TagSelectionProps extends Layer {
    onSelection: (tags: string[]) => void,
}

const TagSelection: FC<TagSelectionProps> = ({$layer, onSelection}) => {
    const [term, setTerm] = useState("")
    const groupTags = useSelector(selectGroupTags)

    return (<>
        <Combobox aria-label="Metadata" openOnFocus>
            <ComboboxInput $layer={$layer} value={term} onChange={e => setTerm(e.target.value)} selectOnClick placeholder="Prohledávat metadata" />
                <ComboboxPopover $layer={$layer}>
                    <ComboboxList $layer={$layer}>
                        <ComboboxOptionSet
                            term={term}
                            onSelection={onSelection}
                            parentTags={[]}
                            options={groupTags}
                            depth={0}
                        />
                    </ComboboxList>
                </ComboboxPopover>
        </Combobox>
    </>)
}

export default TagSelection
