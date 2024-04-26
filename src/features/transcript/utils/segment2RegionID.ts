export const segment2RegionID = (region2ID: Record<string, string>, search: string) => {
    let regionID = ""
    for (const key in region2ID) {
        const segmentID = region2ID[key]
        if (segmentID === search){
            regionID = key
            break
        }
    }
    return regionID
}
