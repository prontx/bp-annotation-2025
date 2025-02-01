import { FC } from "react"

// components
import NamedContainer from "../../../components/NamedContainer"

// style
import styled, { css } from "styled-components"
import { clickableBaseStyles } from "../../../style/clickableBaseStyles"

// redux
import { useAppDispatch } from "../../../redux/hooks"
import { setSpecialChar } from "../redux/transcriptSlice"

// types
import Layer from "../../../types/Layer"


const SpecialCharLaylout = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    div {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(2ch, 4ch));
        gap: 4px;
    }
    `

const CharIcon = styled.span<Layer>` ${({theme, $layer}) => css`
    ${clickableBaseStyles}
    background: ${theme.layers[$layer].background};
    text-align: center;
    padding: 8px 0;
    font-family: Arial;
    
    &:hover {
        background: ${theme.layers[$layer].hover};
    }

    &:active {
        background: ${theme.layers[$layer].active};
    }
`}`

const SpecialChars: FC<Layer> = ({$layer}) => {
    const dispatch = useAppDispatch()

    return (
        <NamedContainer name="Speciální znaky" $layer={$layer}>
            <SpecialCharLaylout className="body">
                <div>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("ḁ́"))}>ḁ́</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("a̬"))}>a̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("á̬"))}>á̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("e̬"))}>e̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("é̬"))}>é̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("ẹ"))}>ẹ</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("ẹ́"))}>ẹ́</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("o̬"))}>o̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("ó̬"))}>ó̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("ọ"))}>ọ</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("ọ́"))}>ọ́</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("u̯"))}>u̯</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("ə"))}>ə</CharIcon>
                </div>
                <div>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("Ḁ́"))}>Ḁ́</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("A̬"))}>A̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("Á̬"))}>Á̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("E̬"))}>E̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("É̬"))}>É̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("Ẹ"))}>Ẹ</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("Ẹ́"))}>Ẹ́</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("O̬"))}>O̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("Ó̬"))}>Ó̬</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("Ọ"))}>Ọ</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("Ọ́"))}>Ọ́</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("U̯"))}>U̯</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("Ə"))}>Ə</CharIcon>
                </div>
                <div>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("ł"))}>ł</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("ł́"))}>ł́</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("Ł"))}>Ł</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("Ł́"))}>Ł́</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("’"))}>’</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("„"))}>„</CharIcon>
                </div>
                <div>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("[]"))}>{"[]"}</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("{}"))}>{"{}"}</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("*"))}>*</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("#"))}>#</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("–"))}>–</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("…"))}>…</CharIcon>
                    <CharIcon $layer={$layer+1} onClick={() => dispatch(setSpecialChar("‿"))}>⠀‿⠀</CharIcon>
                </div>
            </SpecialCharLaylout>
        </NamedContainer>
    )
}

export default SpecialChars
