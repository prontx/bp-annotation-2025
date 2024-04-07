import { FC, Fragment, useEffect, useState } from "react";

// components
import { ComboboxOption } from "@reach/combobox";

// types
import { GroupTag } from "../../../features/transcript/types/Tag";


// Adapted from https://stackoverflow.com/a/37511463 by Lewis Diamond
export const removeDiacritics = (s: string): string => {
    return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

interface ComboboxOptionSetProps {
    term: string,
    options?: GroupTag[],
    onSelection: (tags: string[]) => void,
    parentTags: string[],
    depth: number,
}

const ComboboxOptionSet: FC<ComboboxOptionSetProps> = ({term, options, onSelection, parentTags, depth}) => {
    const [flags, setFlags] = useState<boolean[]>([])

    useEffect(() => {
        if (!options){
            setFlags([])
            return
        }
        setFlags(options.map(option => {
            const cleanTerm = removeDiacritics(term).trim().toLocaleLowerCase()
            const cleanOption = removeDiacritics(option.name).trim().toLocaleLowerCase()
            return cleanOption.includes(cleanTerm)
        }))
    }, [options, term])

    if (!options)
        return null

    return options.map((option, i) => (
        <Fragment key={option.name}>
            {flags[i] && <ComboboxOption
                value={option.name}
                style={{paddingLeft: `${depth*16}px`}}
                onClick={() => onSelection([...parentTags, option.name])}
            />}
            <ComboboxOptionSet
                term={term}
                options={option.subcategories}
                onSelection={onSelection}
                parentTags={[...parentTags, option.name]}
                depth={depth+1}
            />
        </Fragment>)
    )
}

export default ComboboxOptionSet
