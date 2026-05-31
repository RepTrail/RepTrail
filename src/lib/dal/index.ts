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
  dehydrate,
  HydrationBoundary
} from './hooks'

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
  localClear
} from './localDb'

export {
  getSupabaseServer,
  getSupabaseClient,
  removeChannelWithGrace
} from './remote'

export * as actions from './remote'
