import { GroupTag } from "../../transcript/types/Tag"


const stringArr2GroupTag = (tag: string[]): GroupTag => {
    let ret: GroupTag = {label: tag[0]}
    let current: GroupTag = ret
    for (let i = 1; i < tag.length; i++){
        current.subcategories = [{label: tag[i]}]
        current = current.subcategories[0]
    }
    return ret
}

export const addTag = (tags: GroupTag[], newTag: string[]): GroupTag[] => {
    const idx = tags.findIndex(t => t.label === newTag[0])
    if (idx < 0){
        tags.push(stringArr2GroupTag(newTag))
        return tags
    }

    let subtag = tags[idx]
    for (let i = 1; i < newTag.length; i++){ // first already checked
        if (!subtag.subcategories){ // create subcategories
            subtag.subcategories = [stringArr2GroupTag(newTag.slice(i))]
            break
        }
        const subIdx = subtag.subcategories.findIndex(subcategory => subcategory.label === newTag[i])
        if (subIdx < 0){ // insert into subcategories
            subtag.subcategories.push(stringArr2GroupTag(newTag.slice(i)))
            break
        }
        subtag = subtag.subcategories[subIdx]
    }
    return tags
}

export const deleteTag = (tagsRaw: GroupTag[], i:number, tag: string): GroupTag[] => {
    const tags: GroupTag[] = JSON.parse(JSON.stringify(tagsRaw)) // deep copy the object
    if (tags[i].label === tag){
        tags.splice(i, 1)
        return tags
    }
    
    let search: GroupTag[] = []
    for (let current: GroupTag|undefined = tags[i]; current; current = search.shift()){
        if (!current.subcategories){
            continue
        }
        let idx = current.subcategories.findIndex(sc => sc.label === tag)
        if (idx < 0){
            search = search.concat(current.subcategories)
            continue
        }
        if (current.subcategories.length === 1){
            current.subcategories = undefined
        } else {
            current.subcategories.splice(idx, 1)
        }
        break
    }
    return tags
}

export const tagNotInTags = (tag: string[], tags: GroupTag[]|undefined): boolean => {
    if (!tags){
        return true
    }
    let current = tags
    for (let i = 0; i < tag.length; i++){
        const idx = current.findIndex(t => t.label === tag[i])
        if (idx < 0){
            return true
        }
        if (!current[idx].subcategories)
            break
        current = current[idx].subcategories as GroupTag[]
    }
    return false
}
