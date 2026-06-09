// Contrato público de dados Local-First (DAL)
// Todo acesso da interface de usuário (UI) a dados do RepTrail deve ocorrer por meio deste arquivo.

export {
  useProfile,
  useWorkouts,
  useWorkout,
  useWorkoutWithExercises,
  useAssignedWorkout,
  useCreateWorkout,
  useDailyTracking,
  useStudentDailyDiet,
  useStudentTrainer,
  useAssignedDiets,
  useTrainerDiets,
  useDietDetails,
  useCardioDetails,
  useQueryClient,
  useWorkoutStatus,
  useActiveWorkoutSession,
  useQuery,
  useMutation,
  useAuthUser,
  useAdminStudents,
  useImpersonateUser,
  useGrantAutoTraining,
  useDeleteUser,
  dehydrate,
  HydrationBoundary,
  QueryClient,
  QueryClientProvider
} from './hooks'

export { usePlanLimits, getPlanLimitsDetails } from './plan-limits'

export { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'

export type { QueryKey } from './hooks'

export {
  initialSync,
  syncFromRemote,
  syncMutationToRemote
} from './sync'

export {
  getLocalDb,
  localGet,
  localGetAll,
  localPut,
  localDelete,
  localClear,
  logSyncMetric
} from './localDb'

export type { SyncMetric, SyncMetricEvent } from './localDb'

export type { SyncEntity } from './sync'

export {
  getSupabaseClient,
  removeChannelWithGrace,
  getProfileRole,
  uploadPdf,
  subscribeToActivityFeed,
  subscribeToPublicFeed
} from './remote-client'

import type * as ActionsClientType from './actions-client'

// Dynamic Proxy to decouple massive static imports of Server Actions from initial client evaluation.
// This resolves the Turbopack HMR "module factory is not available" runtime crash permanently.
export const actions = new Proxy({} as any, {
  get(target, prop) {
    if (typeof prop === 'symbol') {
      return Reflect.get(target, prop);
    }
    return async (...args: any[]) => {
      const module = await import('./actions-client');
      const fn = (module as any)[prop];
      if (typeof fn !== 'function') {
        throw new Error(`Action "${String(prop)}" is not exported or is not a function in actions-client.`);
      }
      return fn(...args);
    };
  }
}) as typeof ActionsClientType;
