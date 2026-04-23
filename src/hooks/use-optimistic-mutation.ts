import { useMutation, useQueryClient, QueryKey } from '@tanstack/react-query'
import { outboxDB, EntityType } from '@/lib/outbox-db'
import { syncEngine } from '@/lib/sync-engine'

interface UseOptimisticMutationOptions<TData, TVariables, TContext> {
    queryKey: QueryKey
    actionName: string
    entity: EntityType
    entityId?: string
    mutationFn: (variables: TVariables) => Promise<TData>
    updateFn?: (oldData: any, variables: TVariables) => any
    onMutate?: (variables: TVariables) => Promise<TContext> | TContext
    onSuccess?: (data: TData, variables: TVariables, context: any) => void
    onError?: (error: Error, variables: TVariables, context: any) => void
    onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables, context: any) => void
}

/**
 * Enhanced Local-First hook for optimistic mutations using TanStack Query + Persistent Outbox.
 * Enforces Strong Consistency via clientMutationId and localClientId.
 */
export function useOptimisticMutation<TData = any, TVariables = any, TContext = any>({
    queryKey,
    actionName,
    entity,
    entityId: providedEntityId,
    updateFn,
    onMutate,
    onSuccess,
    onError,
    onSettled,
}: UseOptimisticMutationOptions<TData, TVariables, TContext>) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (variables: any) => {
            return variables as any
        },
        onMutate: (rawVariables: any) => {
            // ─── PHASE 1: IDENTITY (SYNCHRONOUS) ──────────────────────────────────
            const clientMutationId = crypto.randomUUID()
            
            // Persistent Client ID (Sync access)
            let localClientId = typeof window !== 'undefined' ? localStorage.getItem('reptrail_client_id') : null
            if (!localClientId && typeof window !== 'undefined') {
                localClientId = crypto.randomUUID()
                localStorage.setItem('reptrail_client_id', localClientId)
            }

            // Determine if it's a creation action that needs an ID
            const isCreation = !rawVariables.id && !actionName.includes('delete') && !actionName.includes('update')
            const entityId = (providedEntityId && providedEntityId !== 'new') 
                ? providedEntityId 
                : (isCreation ? crypto.randomUUID() : (rawVariables.id || 'none'))

            const variables = {
                ...rawVariables,
                clientMutationId,
                clientId: localClientId
            }

            if (isCreation) {
                variables.id = entityId
            }

            const previousData = queryKey ? queryClient.getQueryData(queryKey) : undefined

            // ─── OPTIMISTIC UPDATE (SYNCHRONOUS & INSTANT) ─────────────────────────
            // We update the cache in this same task to trigger React immediately
            if (updateFn && queryKey) {
                queryClient.setQueryData(queryKey, (oldData: any) => updateFn(oldData, variables))
            }

            // ─── PHASE 2: BACKGROUND SIDE EFFECTS ─────────────────────────────────
            // Offload database I/O and query cancellation to the next macro-task
            // This ensures the browser can paint the checkbox state BEFORE doing work.
            setTimeout(() => {
                if (queryKey) {
                    queryClient.cancelQueries({ queryKey })
                }

                // Perform Custom Side Effects (like toasts)
                if (onMutate) {
                    onMutate(variables)
                }

                // Outbox Enqueue (Background)
                outboxDB.enqueue({
                    id: crypto.randomUUID(), 
                    clientMutationId,
                    clientId: localClientId || 'server',
                    action: actionName,
                    payload: variables,
                    entity,
                    entityId,
                } as any).then(() => {
                    syncEngine.trigger()
                }).catch(err => {
                    console.error('[OptimisticMutation] Outbox Enqueue Error:', err)
                })
            }, 0)

            return { previousData, clientMutationId }
        },

        onSuccess: async (data: any, variables: any, context: any) => {
            if (onSuccess) onSuccess(data, variables, context)
        },
        onError: async (err, variables: any, context: any) => {
            if (context?.previousData && queryKey) {
                queryClient.setQueryData(queryKey, context.previousData)
            }
            if (onError) onError(err as Error, variables, context)
        },
        onSettled: (data, error, variables: any, context) => {
            if (onSettled) onSettled(data, error, variables, context)
        },
    })
}
