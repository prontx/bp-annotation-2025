import { createSlice, createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import type { EntityId } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { Segment } from '../../features/transcript/types/Segment'


const segmentAdapter = createEntityAdapter<Segment>({
    selectId: (segment: Segment) => segment.id,
    sortComparer: (a, b) => a.start - b.start,
})

const segmentSlice = createSlice({
    name: 'transcript',
    initialState: segmentAdapter.getInitialState(),
    reducers: {
        updateSegment: segmentAdapter.updateOne,
        loadSegments: segmentAdapter.upsertMany,
    },
})

export const selectSegments = (state: RootState) => state.segments;

export const selectSegmentById = createSelector(
    [selectSegments, (_: RootState, segmentId: EntityId, offset: number = 0) => ({segmentId, offset})],
    (segments, {segmentId, offset}) => {
        let idx = segments.ids.indexOf(segmentId)
        idx = idx + offset
        
        if (idx < 0 || idx >= segments.ids.length) return {id: -1, segment: null }

        return { id: segments.ids[idx], segment: segments.entities[segments.ids[idx]] }
    }
)

/**
 * Select the start segment of the group a segment belongs to. If segment is the start, return the segment. In case of error, return {id: -1, segment: null}.
 */
export const selectGroupStart = createSelector(
    [selectSegments, (_: RootState, segmentId: EntityId) => segmentId],
    (segments, segmentId) => { 
    for (let idx = segments.ids.indexOf(segmentId); idx >= 0; idx--){
            const segment = segments.entities[segments.ids[idx]]
            if (segment && segment.group_tags.length > 0 && segment.group_tags[0] === "!START_group") {
                return { id: segments.ids[idx], segment: segment }
            }
        }
        return { id: -1, segment: null }
    }
)

export const selectIds = createSelector(
    [selectSegments],
    (segments) => segments.ids
)

export const { selectAll, selectById } = segmentAdapter.getSelectors((state :RootState) => state.segments)

export const { updateSegment, loadSegments } = segmentSlice.actions;

export default segmentSlice.reducer;
