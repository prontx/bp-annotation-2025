import { FC, useState } from "react"

// components
import { Combobox } from "@reach/combobox"
import { ComboboxInput } from "./style/ComboboxInput"
import { ComboboxPopover } from "./style/ComboboxPopover"
import { ComboboxList } from "./style/ComboboxList"
import ComboboxOptionSet from "./components/ComboboxOptionSet"

// style
import "@reach/combobox/styles.css"

// types
import Layer from "../../types/Layer"
import { GroupTag } from "../../features/transcript/types/Tag"


interface TagSelectionProps extends Layer {
    options?: GroupTag[],
    onSelection: (tags: string[]) => void,
}

const TagSelection: FC<TagSelectionProps> = ({$layer, options, onSelection}) => {
    const [term, setTerm] = useState("");

    return (<>
        <Combobox aria-label="Metadata" openOnFocus>
            <ComboboxInput $layer={$layer+1} value={term} onChange={e => setTerm(e.target.value)} selectOnClick placeholder="Prohledávat metadata" />
                <ComboboxPopover $layer={$layer+1}>
                    <ComboboxList $layer={$layer+1}>
                        <ComboboxOptionSet
                            term={term}
                            onSelection={onSelection}
                            parentTags={[]}
                            options={options}
                            depth={0}
                        />
                    </ComboboxList>
                </ComboboxPopover>
        </Combobox>
    </>)
}

export default TagSelection
