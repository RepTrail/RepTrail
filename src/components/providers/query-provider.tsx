'use client'

import { QueryClientProvider } from '@tanstack/react-query'
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

        // 🧠 INVARIANT ELITE: Runtime fetch guard
        // Detects any query that fires a fetch without pre-existing data (unexpected waterfall/missing prefetch)
        if (process.env.NODE_ENV === 'development') {
            const unsubscribe = queryClient.getQueryCache().subscribe((event: any) => {
                if (event.type === 'updated' && event.action?.type === 'fetch' && !event.query.state.data) {
                    const key = event.query.queryKey[0];
                    // Ignore session/ephemeral keys that are intentionally non-persistent
                    const ignoredKeys = ['active-workout-session', 'active-cardio-session', 'player'];
                    if (!ignoredKeys.includes(key)) {
                        console.error('🚨 UNEXPECTED FETCH (UNPREFETCHED KEY):', event.query.queryKey);
                    }
                }
            });
            return () => unsubscribe();
        }
    }, [queryClient])

    return (
        <QueryClientProvider client={queryClient}>
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

                            // 🔒 DATA ISOLATION: Exclude sensitive/non-student data from IndexedDB.
                            // This prevents admin/trainer data from persisting on a student's device
                            // and stops ephemeral data from growing the IndexedDB unboundedly.
                            const blacklist = new Set([
                                // Session / transient (highly volatile, no value storing)
                                'active-cardio-session',
                                'active-workout-session',
                                'player',
                                'live',
                                'temp',
                                // Security: never persist on student devices
                                'admin',
                                'trainer',
                                // Ephemeral / public (large, not needed offline)
                                'search',
                                'public',
                                'affiliate',
                            ])

                            const isLargePayload = JSON.stringify(query.state.data || '').length > 1_000_000 // 1MB limit

                            return !blacklist.has(key) && !isLargePayload
                        }
                    }
                }}
            >
                {children}
            </PersistQueryClientProvider>
        </QueryClientProvider>
    )
}
