import { Lookup } from "../../../types/Lookup"
import { Group } from "../types/Group"


export const removeGroupFromLookup = (lookup: Lookup<Group>, groupID: string, parentID?: string) => {
    // Remove from parent's children first
    if (parentID) {
        const parent = lookup.entities[parentID]
        const idx = parent.childrenIDs.findIndex(childID => childID === groupID)
        if (idx !== -1) {
            parent.childrenIDs.splice(idx, 1)
        }
    } else {
        // Fix variable shadowing 
        const idx = lookup.keys.findIndex(key => key === groupID)
        if (idx !== -1) {
            lookup.keys.splice(idx, 1)
        }
    }

    // Collect all groups to delete
    const toDelete: string[] = [groupID]
    let i = 0
    while (i < toDelete.length) {
        const group = lookup.entities[toDelete[i]]
        if (group?.childrenIDs) {
            // Add children to deletion queue
            toDelete.push(...group.childrenIDs)
        }
        i++
    }

    // Remove all references
    toDelete.forEach(deleteID => {
        // Remove from keys array if present
        const keyIndex = lookup.keys.indexOf(deleteID)
        if (keyIndex !== -1) {
            lookup.keys.splice(keyIndex, 1)
        }
        
        // Remove from entities
        delete lookup.entities[deleteID]
    })

    // Clean up any remaining parent references
    Object.values(lookup.entities).forEach(group => {
        if (group) {
            group.childrenIDs = group.childrenIDs.filter(id => !toDelete.includes(id))
        }
    })
}
