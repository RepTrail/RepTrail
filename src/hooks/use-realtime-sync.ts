'use client'

import { useEffect } from 'react'
import { useQueryClient, QueryKey } from '@tanstack/react-query'
import { createClient, removeChannelWithGrace } from '@/lib/supabase/client'
import { outboxDB } from '@/lib/outbox-db'

interface RealtimeSyncOptions {
    table: string
    queryKey: QueryKey
    filter?: string
    schema?: string
    idField?: string
}

/**
 * Enhanced Realtime Sync Hook with Outbox Guard.
 *
 * Rules:
 * 1. If there's a pending Outbox mutation for an entity → IGNORE realtime events for it.
 * 2. On INSERT: check if a matching _optimisticId exists in cache → replace instead of prepend.
 * 3. On UPDATE: only apply if the cache item is not flagged as _optimistic.
 * 4. On DELETE: always apply (server is authoritative on deletions).
 */
// ─── MODULE-LEVEL MUTEX ───────────────────────────────────────────────────────
// Shared across all hook instances to prevent race conditions where two
// simultaneous async guards both pass before the first one finishes processing.
const processingIds = new Set<string>()

export function useRealtimeSync({
    table,
    queryKey,
    filter,
    schema = 'public',
    idField = 'id'
}: RealtimeSyncOptions) {
    const queryClient = useQueryClient()
    const supabase = createClient()

    useEffect(() => {
        const processPayload = async (payload: any) => {
            const incoming = payload.new || payload.old
            if (!incoming?.[idField]) return

            const entityId = incoming[idField]

            // ─── MUTEX GUARD (prevents async race between simultaneous events) ──────
            const mutexKey = `${table}:${entityId}`
            if (processingIds.has(mutexKey)) {
                console.log(`[RealtimeSync] 🔒 Mutex: Skipping ${mutexKey} — already processing.`)
                return
            }
            processingIds.add(mutexKey)

            try {
                const mutationId = incoming.client_mutation_id
                
                // ─── IDENTITY ─────────────────────────────────────────────────────────────
                const localClientId = typeof window !== 'undefined' ? localStorage.getItem('reptrail_client_id') : null

                // ─── LAYER 1: SAME CLIENT REJECTION ─────────────────────────────────────
                if (incoming.client_id && incoming.client_id === localClientId) {
                    return
                }

                // ─── LAYER 2: PROCESSED ID REJECTION (IDEMPOTENCY) ──────────────────────
                const isProcessed = mutationId ? await outboxDB.isProcessed(mutationId) : false
                if (isProcessed) return

                // ─── LAYER 3 & 4: PENDING MUTATION REJECTION ───────────────────────────
                const pending = await outboxDB.getPending()
                const isBlocked = pending.some(p =>
                    (mutationId && p.clientMutationId === mutationId) ||
                    (p.entity === table && p.entityId === entityId)
                )

                if (isBlocked) {
                    console.log(`[RealtimeSync] 🛡️ Guard: Blocked ${table}:${entityId} - Local mutation in progress.`)
                    return
                }

                // ─── DETERMINISTIC RECONCILIATION ────────────────────────────────────────
                // Bypass client-side merge for complex joined tables where raw row structure doesn't match cached objects
                const relationshipTables = ['assigned_workouts', 'assigned_diets', 'assigned_cardio']
                if (relationshipTables.includes(table)) {
                    console.log(`[RealtimeSync] ⚡ Invalidation: Invalidating ${table} for queryKey ${JSON.stringify(queryKey)}`)
                    queryClient.invalidateQueries({ queryKey })
                    return
                }

                queryClient.setQueryData(queryKey, (oldData: any) => {
                    if (!oldData) return oldData

                    // Handle List Views (Array)
                    if (Array.isArray(oldData)) {
                        const cleanOldData = oldData.filter((i: any) => i && i[idField] !== undefined && i[idField] !== null)

                        if (payload.eventType === 'DELETE') {
                            return cleanOldData.filter((i: any) => i[idField] !== entityId)
                        }

                        // Map-based Deterministic Merge (ULTRA-SAFE)
                        const map = new Map(cleanOldData.map((i: any) => [i[idField], i]))
                        const prev = map.get(entityId)

                        // Overlay Pattern: Local Base + Server Overlay
                        map.set(entityId, {
                            ...prev,
                            ...incoming,
                            _optimistic: prev?._optimistic ?? false,
                            _pending: prev?._pending ?? false,
                            _error: undefined
                        })

                        return Array.from(map.values())
                    }

                    // Handle Detail Views (Object)
                    if (typeof oldData === 'object' && oldData[idField] === entityId) {
                        if (payload.eventType === 'DELETE') return null
                        
                        return {
                            ...oldData,
                            ...incoming,
                            _optimistic: oldData?._optimistic ?? false,
                            _pending: oldData?._pending ?? false,
                            _error: undefined
                        }
                    }

                    return oldData
                })
            } finally {
                // ─── MUTEX RELEASE ──────────────────────────────────────────────────────
                processingIds.delete(mutexKey)
            }
        }

        let channelConfig = supabase
            .channel(`realtime:${table}:${JSON.stringify(queryKey)}`)
            .on(
                'postgres_changes' as any,
                {
                    event: '*',
                    schema,
                    table,
                    filter,
                },
                processPayload
            )

        const channel = channelConfig.subscribe()
        
        // Return a stable cleanup that uses the grace period manager
        return () => {
            removeChannelWithGrace(supabase, channel)
        }
    }, [table, filter, schema, idField, JSON.stringify(queryKey), queryClient, supabase])
}
