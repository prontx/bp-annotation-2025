import { speakerColors } from "../../../style/tagColors"
import { SpeakerTag } from "../types/Tag"


export const adaptSpeakers = (speaker_tags: SpeakerTag[]|null|undefined) => {
    if (!speaker_tags)
        return []

    const transformedSpeakers: SpeakerTag[] = []
    let possible_keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    for (const [index, tag] of speaker_tags.entries()){
        if (!tag.label)
            continue

        possible_keys = possible_keys.filter(k => k !== tag.id)
        
        if (!tag.color){
            tag.color = speakerColors[index % speakerColors.length]
        }
        transformedSpeakers.push(tag)
    }
    
    transformedSpeakers.push({
        id: possible_keys[0],
        label: "",
        color: speakerColors[transformedSpeakers.length % speakerColors.length],
    })
    
    return transformedSpeakers
}
