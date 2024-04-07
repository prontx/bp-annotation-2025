import { ChangeEventHandler, FC, Fragment, useState } from "react"

// components
import { Combobox, ComboboxOption } from "@reach/combobox"
import { ComboboxInput } from "./style/ComboboxInput"
import { ComboboxPopover } from "./style/ComboboxPopover"
import { ComboboxList } from "./style/ComboboxList"

// style
import "@reach/combobox/styles.css"

// types
import Layer from "../../types/Layer"
import { GroupTag } from "../../features/transcript/types/Tag"


// Adapted from https://stackoverflow.com/a/37511463 by Lewis Diamond
export const removeDiacritics = (s: string): string => {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

interface TagSelectionProps extends Layer {
    options?: GroupTag[],
    onSelection: (tags: string[]) => void,
}

const TagSelection: FC<TagSelectionProps> = ({$layer, options, onSelection}) => {
    const [term, setTerm] = useState("");
    const results = options || [];

    // TODO: filtering based on term

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        setTerm(e.target.value);
    }

    return (<>
        <Combobox aria-label="Metadata" openOnFocus>
            <ComboboxInput $layer={$layer+1} value={term} onChange={handleChange} selectOnClick placeholder="Prohledávat metadata" />
                <ComboboxPopover $layer={$layer+1}>
                    {results.map(res => (
                        <ComboboxList key={res.name} $layer={$layer+1}>
                            <ComboboxOption value={res.name} onClick={() => onSelection([res.name])}/>
                            {res.subcategories && res.subcategories.map(sub => <Fragment key={sub.name}>
                                <ComboboxOption value={sub.name} style={{paddingLeft: "16px"}} onClick={() => onSelection([res.name, sub.name])}/>
                                {sub.subcategories && sub.subcategories.map(sub2 => 
                                    <ComboboxOption key={sub2.name} value={sub2.name} style={{paddingLeft: "24px"}} onClick={() => onSelection([res.name, sub.name, sub2.name])}/>
                                )}
                            </Fragment>)}
                        </ComboboxList>
                    ))}
                </ComboboxPopover>
        </Combobox>
    </>)
}

export default TagSelection
