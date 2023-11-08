import { FC, useState } from 'react'

// components
import { ComboboxOption } from "@reach/combobox";
import Combobox from "./style/Combobox"
import ComboboxInput from "./style/ComboboxInput"
import ComboboxList from "./style/ComboboxList"
import ComboboxPopover from "./style/ComboboxPopover"
import Button from '../../basic/Button/Button'
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded'

// styles
import "@reach/combobox/styles.css";
import styled from 'styled-components';

// types
import Layer from '../../../style/Layer';
import { TagData } from './types/TagData';

// test data
import test_group_tags from '../../../testing/test_group_tags.json'


const Pretext = styled.p`
    color: ${({theme}) => theme.textSecondary};
    margin-bottom: 2px;
`

const TreeSelectInput: FC<Layer & {callback: (tagValue:string) => void} & React.HTMLAttributes<HTMLDivElement>> = ({layer, callback, ...props}) => {
    const tagTree: TagData[] = test_group_tags
    const [selected, setSelected] = useState<string[]>([])
    const [pretext, setPretext] = useState<string>('')
    const [value, setValue] = useState<string>('')
    const [selectionOptions, setSelectionOptions] = useState<TagData[]>(tagTree)
    const [filteredOptions, setFilteredOptions] = useState<TagData[]>(tagTree)

    const handleSelect = (value: string) => {
        const option = selectionOptions.find(option => option.name === value)
        if (!option) return // this should never happen

        setSelected([...selected, option.name])

        if (option.sub.length){
            setPretext(value)
            setSelectionOptions(option.sub)
            setFilteredOptions(option.sub)
        } else {
            callback(value)
            // console.log(`> add tag ${value}`)
            setPretext('')
            setSelected([])
            setSelectionOptions(tagTree)
            setFilteredOptions(tagTree)
        }

        setValue('')
    }

    const handleSearch = (value: string) => {
        setValue(value)

        const filteredOptions = selectionOptions.filter(option => option.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
        setFilteredOptions(filteredOptions)
    }

    const handleStepBack = () => {
        const newSelected = [...selected]
        newSelected.pop()
        setSelected(newSelected)
        setPretext(newSelected[newSelected.length - 1])
        setValue('')
        let newOptions: TagData[] = tagTree
        newSelected.forEach(step => {
            newOptions = newOptions.find(option => option.name === step)?.sub || []
        })
        setSelectionOptions(newOptions)
        setFilteredOptions(newOptions)
    }

    const selectInput = (event: any) => { // TODO: fix any
        let input = event.target.querySelector('input') || event.target.parentElement.querySelector('input')
        input?.select()
    }

    return (
        <Combobox {...props} aria-label="choose a fruit" openOnFocus layer={layer} onSelect={(item: any) => handleSelect(item)} onClick={selectInput}>
            <Pretext onClick={selectInput}>{(selected.length > 1) ? ".../" : ""}{pretext}{pretext ? "/" : ""}</Pretext>
            <ComboboxInput autocomplete={false} selectOnClick layer={layer} value={value} placeholder={pretext ? "" : "Add tags..."} onChange={(e) => handleSearch(e.target.value)}/>

            {selected.length
                ? <Button className="stepBackBtn" layer={layer} variant="icon" onClick={() => handleStepBack()}><ArrowBackRounded /></Button>
                : null}

            <ComboboxPopover layer={layer} portal={false}>
                <ComboboxList layer={layer}>
                    {filteredOptions.map((option: TagData) => <ComboboxOption key={option.id} value={option.name} />)}
                </ComboboxList>
            </ComboboxPopover>
        </Combobox>
    )
}

export default TreeSelectInput
