import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { get, set, del } from 'idb-keyval'

/**
 * Custom persister for TanStack Query using IndexedDB via idb-keyval.
 * IndexedDB is much faster and more reliable than localStorage for large datasets
 * like workouts and diet history.
 */
export const queryPersister = createAsyncStoragePersister({
    storage: {
        getItem: async (key) => {
            const val = await get(key)
            return val ? val : null
        },
        setItem: async (key, value) => {
            await set(key, value)
        },
        removeItem: async (key) => {
            await del(key)
        },
    },
    // We can add a custom throttle if needed, but default (1000ms) is fine for now
    throttleTime: 1000,
})

export const CACHE_BUSTER = 'v1-reptrail'
