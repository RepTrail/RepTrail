'use client'

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { getQueryClient } from '@/lib/get-query-client'
import { queryPersister, CACHE_BUSTER } from '@/lib/query-persister'
import { ReactNode, useEffect } from 'react'
import { syncEngine } from '@/lib/sync-engine'

/**
 * Enhanced QueryProvider with Local-First Persistence and Outbox Sync.
 * This provider ensures that all data fetched via TanStack Query is stored in IndexedDB
 * and the background sync engine is initialized.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
    const queryClient = getQueryClient()

    useEffect(() => {
        syncEngine.setQueryClient(queryClient)
        syncEngine.start()
    }, [queryClient])

    return (
        <PersistQueryClientProvider
            client={queryClient}
            persistOptions={{
                persister: queryPersister,
                buster: CACHE_BUSTER,
                maxAge: 1000 * 60 * 60 * 24, // 24 hours
                // Bug #5 FIX: filter out sensitive/admin data from local persistence
                dehydrateOptions: {
                    shouldDehydrateQuery: (query) => {
                        const key = query.queryKey[0] as string
                        
                        // 🔴 FIX: Blacklist volatile session/player data from IndexedDB persistence
                        // Blacklist ONLY highly transient OR extremely large sensitive data
                        const blacklist = [
                            'cardioSession', 'workoutSession', 'player', 'live', 'temp',
                            'auth', 'admin'
                        ]
                        
                        const isLargePayload = JSON.stringify(query.state.data || '').length > 1_000_000 // 1MB limit
                        
                        return !blacklist.includes(key) && !isLargePayload
                    }
                }
            }}
        >
            {children}
        </PersistQueryClientProvider>
    )
}
