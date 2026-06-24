'use client'

import { useEffect } from 'react'
import { outboxDB, EntityType } from '@/lib/outbox-db'
import { syncEngine } from '@/services/sync-engine'
import { createClient, removeChannelWithGrace } from '@/lib/supabase/client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
export type { QueryKey } from '@tanstack/react-query'
import { localGetAll, localGet, localPut, localDelete } from './localDb'
import { syncMutationToRemote } from './sync'

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => localGet<Record<string, unknown>>('profiles', userId),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  })
}

export function useWorkouts(userId: string) {
  return useQuery({
    queryKey: ['workouts', userId],
    queryFn: () => localGetAll<Record<string, unknown>>('workouts'),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  })
}

export function useWorkout(id: string) {
  return useQuery({
    queryKey: ['workout', id],
    queryFn: () => localGet<Record<string, unknown>>('workouts', id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  })
}

/**
 * Retorna um treino completo offline agregando seus respectivos exercícios a partir do IndexedDB.
 */
export function useWorkoutWithExercises(id: string) {
  return useQuery({
    queryKey: ['workout-with-exercises', id],
    queryFn: async () => {
      let workout = await localGet<Record<string, unknown>>('workouts', id)
      let allWorkoutExercises = await localGetAll<Record<string, unknown>>('workout_exercises')
      let allExercises = await localGetAll<Record<string, unknown>>('exercises')

      if (!workout) {
        console.warn(`[LocalFirst] Workout ${id} not found locally, falling back to remote...`)
        const { getWorkoutDetails } = await import('@/actions/workout-actions')
        const remoteData = await getWorkoutDetails(id)
        if (!remoteData) return null

        // Cache it locally so it works offline next time
        await localPut('workouts', remoteData)
        if (remoteData.workout_exercises) {
          for (const we of remoteData.workout_exercises) {
            await localPut('workout_exercises', we)
            if (we.exercise) {
              await localPut('exercises', we.exercise)
            }
          }
        }

        workout = await localGet<Record<string, unknown>>('workouts', id)
        allWorkoutExercises = await localGetAll<Record<string, unknown>>('workout_exercises')
        allExercises = await localGetAll<Record<string, unknown>>('exercises')
      }

      const exercises = allWorkoutExercises
        .filter((we: Record<string, unknown>) => we.workout_id === id)
        .map((we: Record<string, unknown>) => {
          const ex = allExercises.find((e: Record<string, unknown>) => e.id === we.exercise_id)
          return { ...we, exercise: ex }
        })
        .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (Number(a.order_index) ?? 0) - (Number(b.order_index) ?? 0))

      return { ...workout, exercises }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  })
}

export function useAssignedWorkout(workoutId: string, studentId: string) {
  return useQuery({
    queryKey: ['assigned-workout', workoutId, studentId],
    queryFn: async () => {
      const allAssigned = await localGetAll<Record<string, unknown>>('assigned_workouts')
      return allAssigned.find((aw: Record<string, unknown>) => aw.workout_id === workoutId && aw.student_id === studentId && aw.active === true) ?? null
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!workoutId && !!studentId,
  })
}

export function useCreateWorkout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (workout: Record<string, unknown>) => {
      const clientMutationId = crypto.randomUUID()
      let localClientId = typeof window !== 'undefined' ? localStorage.getItem('reptrail_client_id') : null
      if (!localClientId && typeof window !== 'undefined') {
        localClientId = crypto.randomUUID()
        localStorage.setItem('reptrail_client_id', localClientId)
      }

      const workoutWithMeta = {
        ...workout,
        id: workout.id || crypto.randomUUID(),
        clientMutationId,
        clientId: localClientId || 'server'
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await localPut('workouts', workoutWithMeta as any)

      const { outboxDB } = await import('@/lib/outbox-db')
      const { syncEngine } = await import('@/services/sync-engine')

      await outboxDB.enqueue({
        id: crypto.randomUUID(),
        clientMutationId,
        clientId: localClientId || 'server',
        action: 'create-manual-workout',
        payload: workoutWithMeta,
        entity: 'workouts',
        entityId: workoutWithMeta.id
      } as unknown as import('@/lib/outbox-db').OutboxRecord)

      void syncEngine.trigger()

      return workoutWithMeta
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['workouts'] })
    },
    onError: (error) => { console.error('[dal] Erro crítico em useCreateWorkout:', error) }
  })
}

export function useDailyTracking(userId: string, date: string) {
  return useQuery({
    queryKey: ['daily_tracking', userId, date],
    queryFn: () => localGetAll<Record<string, unknown>>('daily_tracking').then(
      rows => rows.find((r: Record<string, unknown>) => r.user_id === userId && r.date === date) ?? null
    ),
    staleTime: 1000 * 60 * 2,
    enabled: !!userId && !!date,
  })
}

export function useStudentDailyDiet(userId: string) {
  return useQuery({
    queryKey: ['diets', userId, 'today'],
    queryFn: () => import('@/actions/diet-actions').then(m => m.getStudentDailyDiet(userId)),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  })
}

export function useStudentTrainer(userId: string) {
  return useQuery({
    queryKey: ['student-trainer', userId],
    queryFn: () => import('@/actions/student-actions').then(m => m.getStudentTrainer(userId)),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  })
}

export function useAssignedDiets(userId: string) {
  return useQuery({
    queryKey: ['assigned-diets', userId],
    queryFn: () => import('@/actions/diet-actions').then(m => m.getAssignedDiets(userId)),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  })
}

export function useTrainerDiets(userId: string) {
  return useQuery({
    queryKey: ['trainer-diets', userId],
    queryFn: () => import('@/actions/diet-actions').then(m => m.getTrainerDiets(userId)),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  })
}

export function useDietDetails(dietId: string) {
  return useQuery({
    queryKey: ['diet-details', dietId],
    queryFn: () => import('@/actions/diet-actions').then(m => m.getDietDetails(dietId)),
    staleTime: 1000 * 60 * 5,
    enabled: !!dietId,
  })
}

export function useCardioDetails(cardioId: string) {
  return useQuery({
    queryKey: ['cardio-details', cardioId],
    queryFn: () => import('@/actions/cardio-actions').then(m => m.getCardioDetails(cardioId)),
    staleTime: 1000 * 60 * 5,
    enabled: !!cardioId,
  })
}

export function useWorkoutStatus(userId: string, workoutId: string) {
  return useQuery({
    queryKey: ['workout-status', userId, workoutId],
    queryFn: () => import('@/actions/log-actions').then(m => m.getWorkoutStatus(userId, workoutId)),
    staleTime: 1000 * 60,
    enabled: !!userId && !!workoutId,
  })
}

export function useActiveWorkoutSession() {
  return useQuery({
    queryKey: ['active-workout-session'],
    queryFn: () => import('@/actions/log-actions').then(m => m.getActiveWorkoutSession()),
    staleTime: 1000 * 30,
  })
}

export function useAuthUser() {
  return useQuery({
    queryKey: ['auth-user'],
    queryFn: async () => {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return null
      const profile = await localGet<Record<string, unknown>>('profiles', authUser.id)
      if (profile) return profile

      const { data: remoteProfile } = await supabase.from('profiles').select('*').eq('id', authUser.id).single()
      if (remoteProfile) {
        await localPut('profiles', remoteProfile)
        return remoteProfile
      }
      return authUser
    },
    staleTime: 1000 * 60 * 15,
  })
}

export function useAdminStudents() {
  return useQuery({
    queryKey: ['admin-students'],
    queryFn: () => import('@/actions/admin-actions').then(m => m.getAllUsers()),
    staleTime: 1000 * 60 * 5,
  })
}

export function useImpersonateUser() {
  return useMutation({
    mutationFn: (userId: string) => import('@/actions/admin-actions').then(m => m.impersonateUser(userId)),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => import('@/actions/admin-actions').then(m => m.deleteUser(userId)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-students'] })
    }
  })
}

export function useGrantAutoTraining() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, status }: { studentId: string; status: 'active' | 'none' }) =>
      import('@/actions/admin-actions').then(m => m.grantAutoTraining(studentId, status)),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin-students'] })
    }
  })
}

// â”€â”€â”€ OPTIMISTIC MUTATION HOOK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface UseOptimisticMutationOptions<TData, TVariables, TContext> {
  queryKey: import('@tanstack/react-query').QueryKey
  actionName: string
  entity: EntityType
  entityId?: string
  mutationFn?: (variables: TVariables) => Promise<TData>
  updateFn?: (oldData: unknown, variables: TVariables) => unknown
  onMutate?: (variables: TVariables) => Promise<TContext> | TContext
  onSuccess?: (data: TData, variables: TVariables, context: TContext) => void
  onError?: (error: Error, variables: TVariables, context: TContext) => void
  onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables, context: TContext) => void
  additionalQueryKeys?: import('@tanstack/react-query').QueryKey[]
}

export function useOptimisticMutation<TData = unknown, TVariables = Record<string, unknown>, TContext = unknown>({
  queryKey,
  actionName,
  entity,
  entityId: providedEntityId,
  updateFn,
  onMutate,
  onSuccess,
  onError,
  onSettled,
  additionalQueryKeys = [],
}: UseOptimisticMutationOptions<TData, TVariables, TContext>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      return variables as unknown as TData
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMutate: (rawVariables: any) => {
      const clientMutationId = crypto.randomUUID()
      let localClientId = typeof window !== 'undefined' ? localStorage.getItem('reptrail_client_id') : null
      if (!localClientId && typeof window !== 'undefined') {
        localClientId = crypto.randomUUID()
        localStorage.setItem('reptrail_client_id', localClientId)
      }

      const isCreation = !rawVariables.id && !actionName.includes('delete') && !actionName.includes('update')
      const entityId = (providedEntityId && providedEntityId !== 'new')
        ? providedEntityId
        : (isCreation ? crypto.randomUUID() : (rawVariables.id || 'none'))

      const variables = { ...rawVariables, clientMutationId, clientId: localClientId }
      if (isCreation) variables.id = entityId

      const previousData = queryKey ? queryClient.getQueryData(queryKey) : undefined

      if (updateFn && queryKey) {
        queryClient.setQueryData(queryKey, (oldData: unknown) => updateFn(oldData, variables as unknown as TVariables))
      }

      if (onMutate) onMutate(variables)

      setTimeout(() => {
        if (queryKey) queryClient.cancelQueries({ queryKey })
        additionalQueryKeys.forEach(key => queryClient.cancelQueries({ queryKey: key }))

        outboxDB.enqueue({
          id: crypto.randomUUID(),
          clientMutationId,
          clientId: localClientId || 'server',
          action: actionName,
          payload: variables,
          entity,
          entityId,
        } as unknown as import('@/lib/outbox-db').OutboxRecord).then(() => {
          void syncEngine.trigger()
        }).catch(err => console.error('[OptimisticMutation] Outbox Enqueue Error:', err))
      }, 0)

      return { previousData, clientMutationId }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess: async (data: any, variables: any, context: any) => {
      if (onSuccess) onSuccess(data, variables, context)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: async (err: any, variables: any, context: any) => {
      if ((context as Record<string, unknown>)?.previousData && queryKey) queryClient.setQueryData(queryKey, (context as Record<string, unknown>).previousData)
      if (onError) onError(err as Error, variables, context)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSettled: (data: any, error: any, variables: any, context: any) => {
      if (onSettled) onSettled(data, error, variables, context)
    },
  })
}

// â”€â”€â”€ REALTIME SYNC HOOK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface RealtimeSyncOptions {
  table: string
  queryKey: import('@tanstack/react-query').QueryKey
  filter?: string
  schema?: string
  idField?: string
}

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
    const processPayload = async (payload: Record<string, unknown>) => {
      const incoming = (payload.new || payload.old) as Record<string, unknown>
      if (!incoming?.[idField]) return

      const entityId = incoming[idField] as string
      const mutexKey = `${table}:${entityId}`
      if (processingIds.has(mutexKey)) return
      processingIds.add(mutexKey)

      try {
        const mutationId = incoming.client_mutation_id as string | undefined
        const localClientId = typeof window !== 'undefined' ? localStorage.getItem('reptrail_client_id') : null
        if (incoming.client_id && incoming.client_id === localClientId) return

        const isProcessed = mutationId ? await outboxDB.isProcessed(mutationId) : false
        if (isProcessed) return

        const pending = await outboxDB.getPending()
        const isBlocked = pending.some(p =>
          (mutationId && p.clientMutationId === mutationId) ||
          (p.entity === table && p.entityId === entityId)
        )

        if (isBlocked) return

        try {
          const { localPut, localDelete, getLocalDb } = await import('@/lib/dal')
          const db = await getLocalDb()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (db.objectStoreNames.contains(table as any)) {
            if (payload.eventType === 'DELETE') {
              await localDelete(table as keyof import('./localDb').RepTrailDB, entityId)
            } else {
              await localPut(table as keyof import('./localDb').RepTrailDB, incoming as any)
            }
          }
        } catch (dbErr) {
          console.error('[RealtimeSync] Failed to persist realtime change:', dbErr)
        }

        const relationshipTables = ['assigned_workouts', 'assigned_diets', 'assigned_cardio']
        if (relationshipTables.includes(table)) {
          void queryClient.invalidateQueries({ queryKey })
          return
        }

        queryClient.setQueryData(queryKey, (oldData: unknown) => {
          if (!oldData) return oldData
          if (Array.isArray(oldData)) {
            const cleanOldData = oldData.filter((i: Record<string, unknown>) => i && i[idField] !== undefined && i[idField] !== null)
            if (payload.eventType === 'DELETE') return cleanOldData.filter((i: Record<string, unknown>) => i[idField] !== entityId)
            const map = new Map(cleanOldData.map((i: Record<string, unknown>) => [i[idField], i]))
            const prev = map.get(entityId)
            map.set(entityId, { ...prev, ...incoming, _optimistic: prev?._optimistic ?? false, _pending: prev?._pending ?? false, _error: undefined })
            return Array.from(map.values())
          }
          if (typeof oldData === 'object' && (oldData as Record<string, unknown>)[idField] === entityId) {
            if (payload.eventType === 'DELETE') return null
            return { ...oldData, ...incoming, _optimistic: (oldData as Record<string, unknown>)?._optimistic ?? false, _pending: (oldData as Record<string, unknown>)?._pending ?? false, _error: undefined }
          }
          return oldData
        })
      } finally {
        processingIds.delete(mutexKey)
      }
    }

    let channelConfig = supabase.channel(`realtime:${table}:${JSON.stringify(queryKey)}`).on(
      'postgres_changes' as never,
      { event: '*', schema, table, filter },
      processPayload
    )

    const channel = channelConfig.subscribe()
    return () => { removeChannelWithGrace(supabase, channel) }
  }, [table, filter, schema, idField, JSON.stringify(queryKey), queryClient, supabase])
}
