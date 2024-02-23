import { Word } from "../features/transcript/types/Word";

export const segmentWords2String = (words: Word[]|null): string => {
    let text = ""
    if (words){
        words.forEach(word => text = `${text} ${word.label}`)
    }
    return text
}
