import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
export { useQuery, useMutation, useQueryClient, dehydrate, HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query'
export type { QueryKey } from '@tanstack/react-query'
import { localGetAll, localGet, localPut, localDelete } from './localDb'
import { syncMutationToRemote } from './sync'

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => localGet<any>('profiles', userId),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  })
}

export function useWorkouts(userId: string) {
  return useQuery({
    queryKey: ['workouts', userId],
    queryFn: () => localGetAll<any>('workouts'),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  })
}

export function useWorkout(id: string) {
  return useQuery({
    queryKey: ['workout', id],
    queryFn: () => localGet<any>('workouts', id),
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
      let workout = await localGet<any>('workouts', id)
      let allWorkoutExercises = await localGetAll<any>('workout_exercises')
      let allExercises = await localGetAll<any>('exercises')

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
        
        workout = await localGet<any>('workouts', id)
        allWorkoutExercises = await localGetAll<any>('workout_exercises')
        allExercises = await localGetAll<any>('exercises')
      }
      
      const exercises = allWorkoutExercises
        .filter((we: any) => we.workout_id === id)
        .map((we: any) => {
          const ex = allExercises.find((e: any) => e.id === we.exercise_id)
          return { ...we, exercise: ex }
        })
        .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
        
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
      const allAssigned = await localGetAll<any>('assigned_workouts')
      return allAssigned.find((aw: any) => aw.workout_id === workoutId && aw.student_id === studentId && aw.active === true) ?? null
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!workoutId && !!studentId,
  })
}

export function useCreateWorkout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (workout: any) => {
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

      await localPut('workouts', workoutWithMeta)

      const { outboxDB } = await import('@/lib/outbox-db')
      const { syncEngine } = await import('@/lib/sync-engine')

      await outboxDB.enqueue({
        id: crypto.randomUUID(),
        clientMutationId,
        clientId: localClientId || 'server',
        action: 'create-manual-workout',
        payload: workoutWithMeta,
        entity: 'workouts',
        entityId: workoutWithMeta.id
      } as any)

      syncEngine.trigger()

      return workoutWithMeta
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['workouts'] }) 
    },
    onError: (error) => { console.error('[dal] Erro crítico em useCreateWorkout:', error) }
  })
}

export function useDailyTracking(userId: string, date: string) {
  return useQuery({
    queryKey: ['daily_tracking', userId, date],
    queryFn: () => localGetAll<any>('daily_tracking').then(
      rows => rows.find((r: any) => r.user_id === userId && r.date === date) ?? null
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
      const profile = await localGet<any>('profiles', authUser.id)
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
      queryClient.invalidateQueries({ queryKey: ['admin-students'] })
    }
  })
}

export function useGrantAutoTraining() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ studentId, status }: { studentId: string; status: 'active' | 'none' }) => 
      import('@/actions/admin-actions').then(m => m.grantAutoTraining(studentId, status)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] })
    }
  })
}


