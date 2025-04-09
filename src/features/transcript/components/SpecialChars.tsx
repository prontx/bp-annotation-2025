import { FC, useState } from "react"

// components
import NamedContainer from "../../../components/NamedContainer"

// style
import styled, { css } from "styled-components"
import { clickableBaseStyles } from "../../../style/clickableBaseStyles"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { addCustomChar, setSpecialChar } from "../redux/transcriptSlice"

// types
import Layer from "../../../types/Layer"
import { useSelector } from "react-redux"
import { RootState } from "../../../redux/store"


const SpecialCharLaylout = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #646464;
    border-radius: 1px 1px 10px 10px;

    div {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(2ch, 4ch));
        gap: 4px;
    }
    `

const CharIcon = styled.span<Layer>` ${({theme, $layer}) => css`
    ${clickableBaseStyles}
    // background: ${theme.layers[$layer].background};
    background: #1F1F1F;
    text-align: center;
    padding: 8px 0;
    font-family: Arial;
    color: white;
    
    &:hover {
        // background: ${theme.layers[$layer].hover};
        color: #35C073;
        background: #363636;
    }

    &:active {
        background: ${theme.layers[$layer].active};
    }
`}`

const SpecialChars: FC<Layer> = ({$layer}) => {
    const dispatch = useAppDispatch()
    const [newChar, setNewChar] = useState('');
    const { default: defaultChars, custom: customChars } = useSelector(
        (state: RootState) => state.transcript.specialChars
    );

    // Function to group characters into rows
    const groupChars = (chars: string[], groupSize = 50) => {
        const groups = [];
        for (let i = 0; i < chars.length; i += groupSize) {
            groups.push(chars.slice(i, i + groupSize));
        }
        return groups;
    };


    return (
        <NamedContainer name="Speciální znaky" $layer={$layer}>
            <SpecialCharLaylout className="body">
                {/* Default Characters */}
                {groupChars(defaultChars).map((group, groupIndex) => (
                    <div key={`default-${groupIndex}`}>
                        {group.map((char) => (
                            <CharIcon 
                                key={char}
                                $layer={$layer + 1} 
                                onClick={() => dispatch(setSpecialChar(char))}
                            >
                                {char}
                            </CharIcon>
                        ))}
                    </div>
                ))}

                {/* Custom Characters */}
                {customChars.length > 0 && groupChars(customChars).map((group, groupIndex) => (
                    <div key={`custom-${groupIndex}`}>
                        {group.map((char) => (
                            <CharIcon
                                key={char}
                                $layer={$layer + 1}
                                onClick={() => dispatch(setSpecialChar(char))}
                            >
                                {char}
                            </CharIcon>
                        ))}
                    </div>
                ))}

                {/* Add Custom Character Input */}
                <div style={{ marginTop: '1rem', display: 'flex', gap: '8px' }}>
                    <input 
                        value={newChar}
                        onChange={(e) => setNewChar(e.target.value)}
                        placeholder="Vlastní znak"
                        style={{ flexGrow: 1, height: "25px", background: "#1F1F1F", color: "white", borderRadius: "5px", borderColor:"#1F1F1F",  padding: "4px", marginBottom: "10px" }}
                    />
                    <button
                        onClick={() => {
                            if (newChar.trim()) {
                                dispatch(addCustomChar(newChar.trim()));
                                setNewChar('');
                            }
                        }}
                        style={{ flexShrink: 0, height: "25px", background: "#1F1F1F", color: "white", borderRadius: "5px", borderColor:"#1F1F1F", padding: "4px 8px" }}
                    >
                        Přidat
                    </button>
                </div>
            </SpecialCharLaylout>
        </NamedContainer>
    )
}

export default SpecialChars
