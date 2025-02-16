import { ChangeEventHandler, FC, InputHTMLAttributes, KeyboardEventHandler, useState } from "react"

// style
import styled, { css } from "styled-components"
import { editableBaseStyles } from "../style/editableBaseStyles"

// types
import Layer from "../types/Layer"


interface IntegerInputProps extends Layer, InputHTMLAttributes<HTMLInputElement> {
    value: number,
    $width: string,
    min?: number,
    max?: number,
    updateGlobalValue: (x: number) => void,
}

const StyledInput = styled.input<Layer & {$width: string}>` ${({theme, $layer, $width}) => css`
    ${editableBaseStyles}
    background: ${theme.layers[$layer].background};
    color: ${theme.textSecondary};
    width: ${$width};
    font-size: 1rem;
    padding: 4px 8px;
    text-align: end;
    margin-right: 4px;
    color: white;

    &:hover {
        background: ${theme.layers[$layer].hover};
    }

    &:active, &:focus {
        background: ${theme.layers[$layer].active};
        color: ${theme.textPrimary};
        outline: none;
    }
`}`

const IntegerInput: FC<IntegerInputProps> = ({value, min, max, updateGlobalValue, ...props}) => {
    const [stringValue, setStringValue] = useState(`${value}`)

    const ensureValidValue = () => {
        setStringValue(`${value}`)
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
        // remove non-digit characters
        const newStringValue = e.target.value.replaceAll(/[^0-9]/g, "")
        const newValue = parseInt(newStringValue)

        // check range
        if (!isNaN(newValue) && (!min || newValue >= min) && (!max || newValue <= max)){
            setStringValue(newStringValue)
            updateGlobalValue(newValue)
        } else if (newStringValue === ""){
            setStringValue(newStringValue)
        }
    }

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
        e.stopPropagation()
        if (e.key === "ArrowUp" && (!max || value < max)){
            setStringValue(`${value+1}`)
            updateGlobalValue(value+1)
        } else if (e.key === "ArrowDown" && (!min || value > min)){
            setStringValue(`${value-1}`)
            updateGlobalValue(value-1)
        }
    }

    return (
        <StyledInput
            type="string"
            value={stringValue}
            onBlur={ensureValidValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            {...props}
        />
    )
}

export default IntegerInput
