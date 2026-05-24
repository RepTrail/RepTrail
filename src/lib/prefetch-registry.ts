import { QUERY_KEYS } from "./query-keys";
import type { QueryKey } from '@tanstack/react-query'

// 🧠 Dynamic imports used below in PREFETCH_REGISTRY to avoid Turbopack HMR errors
// This prevents "Module factory not available" errors when server actions are imported statically in client contexts.

export type PrefetchConfig = {
    queryKey: QueryKey;
    queryFn: () => Promise<any>;
};

const getGlobalStudentConfigs = (userId: string): PrefetchConfig[] => [
    { queryKey: [...QUERY_KEYS.workouts.session], queryFn: () => import('@/actions/log-actions').then(m => m.getActiveWorkoutSession()) },
    { queryKey: [...QUERY_KEYS.cardio.session], queryFn: () => import('@/actions/cardio-actions').then(m => m.getActiveCardioSession()) },
    { queryKey: QUERY_KEYS.student.details(userId), queryFn: () => import('@/actions/student-actions').then(m => m.getStudentProfile(userId)) },
    { queryKey: QUERY_KEYS.profile.trainer(userId), queryFn: () => import('@/actions/student-actions').then(m => m.getStudentTrainer(userId)) },
];

const getGlobalTrainerConfigs = (userId: string): PrefetchConfig[] => [
    { queryKey: QUERY_KEYS.trainer.profile(userId), queryFn: () => import('@/actions/trainer-actions').then(m => m.getTrainerProfile(userId)) },
    { queryKey: QUERY_KEYS.trainer.effectiveTier(userId), queryFn: () => import('@/actions/trainer-actions').then(m => m.getEffectiveTier(userId)) },
];

export const PREFETCH_REGISTRY: Record<string, (userId: string) => PrefetchConfig[]> = {
    '/dashboard/student': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.workouts.today(userId), queryFn: () => import('@/actions/workout-actions').then(m => m.getTodayWorkout(userId)) },
        { queryKey: QUERY_KEYS.workouts.all(userId), queryFn: () => import('@/actions/workout-actions').then(m => m.getAssignedWorkouts(userId)) },
        { queryKey: QUERY_KEYS.cardio.today(userId), queryFn: () => import('@/actions/cardio-actions').then(m => m.getTodayCardio(userId)) },
        { queryKey: QUERY_KEYS.cardio.all(userId), queryFn: () => import('@/actions/cardio-actions').then(m => m.getAssignedCardios(userId)) },
        { queryKey: QUERY_KEYS.diets.today(userId), queryFn: () => import('@/actions/diet-actions').then(m => m.getStudentDailyDiet(userId)) },
        { queryKey: QUERY_KEYS.diets.all(userId), queryFn: () => import('@/actions/diet-actions').then(m => m.getAssignedDiets(userId)) },
        { 
            queryKey: QUERY_KEYS.ergogenics.all(userId), 
            queryFn: async () => { 
                const { getStudentErgogenics } = await import('@/actions/ergogenics-actions');
                const res = await getStudentErgogenics(userId); 
                return Array.isArray(res) ? res : (res as any).data || []; 
            } 
        },
        { queryKey: QUERY_KEYS.ergogenics.logs(userId), queryFn: () => import('@/actions/ergogenics-actions').then(m => m.getTodayErgogenicLogs(userId)) },
        { queryKey: QUERY_KEYS.student.metricsSummary(userId), queryFn: () => import('@/actions/metrics-actions').then(m => m.getMetricsSummary(userId)) },
        { queryKey: QUERY_KEYS.workouts.logs(userId), queryFn: () => import('@/actions/log-actions').then(m => m.getStudentWorkoutHistory(userId)) },
        { queryKey: QUERY_KEYS.cardio.logs(userId), queryFn: () => import('@/actions/cardio-actions').then(m => m.getCardioStatus(userId)) },
        { queryKey: QUERY_KEYS.student.hasProtocol(userId), queryFn: () => import('@/actions/ai-protocol-actions').then(m => m.checkStudentHasProtocol(userId)) },
        { queryKey: QUERY_KEYS.trainer.ranking(), queryFn: () => import('@/actions/trainer-actions').then(m => m.getTrainerRanking()) },
    ],
    '/dashboard/student/workouts': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.workouts.all(userId), queryFn: () => import('@/actions/workout-actions').then(m => m.getAssignedWorkouts(userId)) },
        { queryKey: QUERY_KEYS.workouts.library(userId), queryFn: () => import('@/actions/workout-actions').then(m => m.getTrainerWorkouts(userId)) },
    ],
    '/dashboard/student/cardio': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.cardio.all(userId), queryFn: () => import('@/actions/cardio-actions').then(m => m.getAssignedCardios(userId)) },
        { queryKey: QUERY_KEYS.cardio.library(userId), queryFn: () => import('@/actions/cardio-actions').then(m => m.getCardioLibrary(userId)) },
    ],
    '/dashboard/student/diet': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.diets.today(userId), queryFn: () => import('@/actions/diet-actions').then(m => m.getStudentDailyDiet(userId)) },
        { queryKey: QUERY_KEYS.diets.all(userId), queryFn: () => import('@/actions/diet-actions').then(m => m.getAssignedDiets(userId)) },
        { queryKey: QUERY_KEYS.diets.library(userId), queryFn: () => import('@/actions/diet-actions').then(m => m.getTrainerDiets(userId)) },
    ],
    '/dashboard/student/ergogenics': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { 
            queryKey: QUERY_KEYS.ergogenics.all(userId), 
            queryFn: async () => { 
                const { getStudentErgogenics } = await import('@/actions/ergogenics-actions');
                const res = await getStudentErgogenics(userId); 
                return Array.isArray(res) ? res : (res as any).data || []; 
            } 
        },
        { queryKey: QUERY_KEYS.ergogenics.logs(userId), queryFn: () => import('@/actions/ergogenics-actions').then(m => m.getTodayErgogenicLogs(userId)) },
    ],
    '/dashboard/student/profile': (userId) => [
        ...getGlobalStudentConfigs(userId),
    ],
    '/dashboard/student/progress': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.student.metricsSummary(userId), queryFn: () => import('@/actions/metrics-actions').then(m => m.getMetricsSummary(userId)) },
        { queryKey: QUERY_KEYS.student.metrics(userId), queryFn: () => import('@/actions/metrics-actions').then(m => m.getStudentFullMetrics(userId)) },
        { queryKey: QUERY_KEYS.student.activity(userId), queryFn: () => import('@/actions/log-actions').then(m => m.getStudentWorkoutHistory(userId)) },
        { queryKey: ['adherence', 30], queryFn: () => import('@/actions/tracking-actions').then(m => m.getAdherenceHistory(30)) }
    ],
    '/dashboard/student/anamnese': (userId) => [
        ...getGlobalStudentConfigs(userId),
    ],
    '/dashboard/student/ranking': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.admin.trainers, queryFn: () => import('@/actions/trainer-actions').then(m => m.getTrainerRanking()) },
    ],
    '/dashboard/student/meu-personal': (userId) => [
        ...getGlobalStudentConfigs(userId),
    ],
    '/dashboard/student/loja': (userId) => [
        ...getGlobalStudentConfigs(userId),
    ],
    '/dashboard/trainer': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.trainer.profile(userId), queryFn: () => import('@/actions/trainer-actions').then(m => m.getTrainerProfile(userId)) },
        { queryKey: QUERY_KEYS.trainer.effectiveTier(userId), queryFn: () => import('@/actions/trainer-actions').then(m => m.getEffectiveTier(userId)) },
        { queryKey: QUERY_KEYS.trainer.activity(userId), queryFn: () => import('@/actions/trainer-actions').then(m => m.getTrainerActivityFeed(userId)) },
        { queryKey: QUERY_KEYS.trainer.students(userId), queryFn: () => import('@/actions/trainer-actions').then(m => m.getTrainerStudents(userId)) },
    ],
    '/dashboard/trainer/students': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.trainer.students(userId), queryFn: () => import('@/actions/trainer-actions').then(m => m.getTrainerStudents(userId)) },
    ],
    '/dashboard/trainer/workouts': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.workouts.library(userId), queryFn: () => import('@/actions/workout-actions').then(m => m.getTrainerWorkouts(userId)) },
    ],
    '/dashboard/trainer/diets': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.diets.library(userId), queryFn: () => import('@/actions/diet-actions').then(m => m.getTrainerDiets(userId)) },
    ],
    '/dashboard/trainer/cardio': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.cardio.library(userId), queryFn: () => import('@/actions/cardio-actions').then(m => m.getCardioLibrary(userId)) },
    ],
    '/dashboard/trainer/ergogenics': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.ergogenics.hub(userId), queryFn: () => import('@/actions/ergogenics-actions').then(m => m.getTrainerErgogenicStudents(userId)) },
    ],
    '/dashboard/trainer/ranking': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.admin.trainers, queryFn: () => import('@/actions/trainer-actions').then(m => m.getTrainerRanking()) },
    ],
    '/dashboard/trainer/profile': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.trainer.profile(userId), queryFn: () => import('@/actions/trainer-actions').then(m => m.getTrainerProfile(userId)) },
    ],
    '/dashboard/trainer/import-pdf': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.trainer.students(userId), queryFn: () => import('@/actions/trainer-actions').then(m => m.getTrainerStudents(userId)) },
    ],
    '/dashboard/trainer/students/[id]': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.workouts.today(userId), queryFn: () => import('@/actions/workout-actions').then(m => m.getTodayWorkout(userId)) },
        { queryKey: QUERY_KEYS.workouts.all(userId), queryFn: () => import('@/actions/workout-actions').then(m => m.getAssignedWorkouts(userId)) },
        { queryKey: QUERY_KEYS.diets.today(userId), queryFn: () => import('@/actions/diet-actions').then(m => m.getStudentDailyDiet(userId)) },
        { queryKey: QUERY_KEYS.diets.all(userId), queryFn: () => import('@/actions/diet-actions').then(m => m.getAssignedDiets(userId)) },
        { queryKey: QUERY_KEYS.cardio.today(userId), queryFn: () => import('@/actions/cardio-actions').then(m => m.getTodayCardio(userId)) },
        { queryKey: QUERY_KEYS.cardio.all(userId), queryFn: () => import('@/actions/cardio-actions').then(m => m.getAssignedCardios(userId)) },
        { queryKey: QUERY_KEYS.ergogenics.all(userId), queryFn: () => import('@/actions/ergogenics-actions').then(m => m.getStudentErgogenics(userId)) },
        { queryKey: QUERY_KEYS.ergogenics.logs(userId), queryFn: () => import('@/actions/ergogenics-actions').then(m => m.getTodayErgogenicLogs(userId)) },
    ]
};
