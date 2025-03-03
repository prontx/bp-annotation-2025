import { Lookup } from "../../../types/Lookup"
import { Group } from "../types/Group"


export const removeGroupFromLookup = (lookup: Lookup<Group>, groupID: string, parentID?: string) => {
    // Filter instead of splice
    lookup.keys = lookup.keys.filter(key => key !== groupID)
    
    if (parentID) {
        const parent = lookup.entities[parentID]
        if (parent) {
            // Filter children
            parent.childrenIDs = parent.childrenIDs.filter(id => id !== groupID)
        }
    }

    // Recursive child deletion with immutability
    const deleteChildren = (id: string) => {
        const group = lookup.entities[id]
        if (group?.childrenIDs) {
            group.childrenIDs.forEach(deleteChildren)
            delete lookup.entities[id]
        }
    }
    
    deleteChildren(groupID)
    delete lookup.entities[groupID]
}
