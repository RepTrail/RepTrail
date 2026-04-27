import { QUERY_KEYS } from "./query-keys";
import { getStudentProfile, getStudentTrainer, getStudentDetails } from "@/actions/student-actions";
import { getTodayWorkout, getAssignedWorkouts, getTrainerWorkouts } from "@/actions/workout-actions";
import { getTodayCardio, getAssignedCardios, getCardioLibrary, getCardioStatus, getActiveCardioSession } from "@/actions/cardio-actions";
import { getStudentDailyDiet, getAssignedDiets, getTrainerDiets } from "@/actions/diet-actions";
import { getStudentErgogenics, getTodayErgogenicLogs } from "@/actions/ergogenics-actions";
import { getMetricsSummary, getStudentFullMetrics } from "@/actions/metrics-actions";
import { getActiveWorkoutSession, getStudentWorkoutHistory } from "@/actions/log-actions";
import { getTrainerRanking, getTrainerProfile, getEffectiveTier, getTrainerActivityFeed, getTrainerStudents } from "@/actions/trainer-actions";
import { getAdherenceHistory } from "@/actions/tracking-actions";
import { checkStudentHasProtocol } from "@/actions/ai-protocol-actions";
import { getBetaTesterMode } from "@/actions/app-settings-actions";

export type PrefetchConfig = {
    queryKey: any[];
    queryFn: () => Promise<any>;
};

const getGlobalStudentConfigs = (userId: string): PrefetchConfig[] => [
    { queryKey: [...QUERY_KEYS.workouts.session], queryFn: () => getActiveWorkoutSession() },
    { queryKey: [...QUERY_KEYS.cardio.session], queryFn: () => import('@/actions/cardio-actions').then(m => m.getActiveCardioSession()) },
    { queryKey: QUERY_KEYS.student.details(userId), queryFn: () => getStudentProfile(userId) },
    { queryKey: QUERY_KEYS.profile.trainer(userId), queryFn: () => getStudentTrainer(userId) },
];

const getGlobalTrainerConfigs = (userId: string): PrefetchConfig[] => [
    { queryKey: QUERY_KEYS.profile.detail(userId), queryFn: () => getTrainerProfile() },
    { queryKey: QUERY_KEYS.trainer.effectiveTier(userId), queryFn: () => getEffectiveTier() },
    { queryKey: QUERY_KEYS.trainer.ranking(), queryFn: () => getTrainerRanking() },
];

export const PREFETCH_REGISTRY: Record<string, (userId: string) => PrefetchConfig[]> = {
    '/dashboard/student': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.workouts.today(userId), queryFn: () => getTodayWorkout(userId) },
        { queryKey: QUERY_KEYS.workouts.all(userId), queryFn: () => getAssignedWorkouts(userId) },
        { queryKey: QUERY_KEYS.cardio.today(userId), queryFn: () => getTodayCardio(userId) },
        { queryKey: QUERY_KEYS.cardio.all(userId), queryFn: () => getAssignedCardios(userId) },
        { queryKey: QUERY_KEYS.diets.today(userId), queryFn: () => getStudentDailyDiet(userId) },
        { queryKey: QUERY_KEYS.diets.all(userId), queryFn: () => getAssignedDiets(userId) },
        { queryKey: QUERY_KEYS.ergogenics.all(userId), queryFn: async () => { const res = await getStudentErgogenics(userId); return Array.isArray(res) ? res : (res as any).data || []; } },
        { queryKey: QUERY_KEYS.ergogenics.logs(userId), queryFn: () => getTodayErgogenicLogs(userId) },
        { queryKey: QUERY_KEYS.student.metricsSummary(userId), queryFn: () => getMetricsSummary(userId) },
        { queryKey: QUERY_KEYS.workouts.logs(userId), queryFn: () => getStudentWorkoutHistory(userId) },
        { queryKey: QUERY_KEYS.cardio.logs(userId), queryFn: () => getCardioStatus(userId) },
        { queryKey: QUERY_KEYS.student.hasProtocol(userId), queryFn: () => checkStudentHasProtocol(userId) },
        { queryKey: QUERY_KEYS.trainer.ranking(), queryFn: () => getTrainerRanking() },
    ],
    '/dashboard/student/workouts': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.workouts.all(userId), queryFn: () => getAssignedWorkouts(userId) },
        { queryKey: QUERY_KEYS.workouts.library(userId), queryFn: () => getTrainerWorkouts() },
    ],
    '/dashboard/student/cardio': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.cardio.all(userId), queryFn: () => getAssignedCardios(userId) },
        { queryKey: QUERY_KEYS.cardio.library(userId), queryFn: () => getCardioLibrary() },
    ],
    '/dashboard/student/diet': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.diets.today(userId), queryFn: () => getStudentDailyDiet(userId) },
        { queryKey: QUERY_KEYS.diets.all(userId), queryFn: () => getAssignedDiets(userId) },
        { queryKey: QUERY_KEYS.diets.library(userId), queryFn: () => getTrainerDiets() },
    ],
    '/dashboard/student/ergogenics': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.ergogenics.all(userId), queryFn: async () => { const res = await getStudentErgogenics(userId); return Array.isArray(res) ? res : (res as any).data || []; } },
        { queryKey: QUERY_KEYS.ergogenics.logs(userId), queryFn: () => getTodayErgogenicLogs(userId) },
    ],
    '/dashboard/student/profile': (userId) => [
        ...getGlobalStudentConfigs(userId),
    ],
    '/dashboard/student/progress': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.student.metricsSummary(userId), queryFn: () => getMetricsSummary(userId) },
        { queryKey: QUERY_KEYS.student.metrics(userId), queryFn: () => getStudentFullMetrics(userId) },
        { queryKey: QUERY_KEYS.student.activity(userId), queryFn: () => getStudentWorkoutHistory(userId) },
        { queryKey: ['adherence', 30], queryFn: () => getAdherenceHistory(30) }
    ],
    '/dashboard/student/anamnese': (userId) => [
        ...getGlobalStudentConfigs(userId),
    ],
    '/dashboard/student/ranking': (userId) => [
        ...getGlobalStudentConfigs(userId),
        { queryKey: QUERY_KEYS.trainer.ranking(), queryFn: () => getTrainerRanking() }
    ],
    '/dashboard/student/meu-personal': (userId) => [
        ...getGlobalStudentConfigs(userId),
    ],
    '/dashboard/student/loja': (userId) => [
        ...getGlobalStudentConfigs(userId),
    ],
    '/dashboard/trainer': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.trainer.activity(userId), queryFn: () => getTrainerActivityFeed() },
    ],
    '/dashboard/trainer/students': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.trainer.students(userId), queryFn: () => getTrainerStudents() },
    ],
    '/dashboard/trainer/workouts': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.workouts.library(userId), queryFn: () => getTrainerWorkouts() },
    ],
    '/dashboard/trainer/diets': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.diets.library(userId), queryFn: () => getTrainerDiets() },
    ],
    '/dashboard/trainer/cardio': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.cardio.library(userId), queryFn: () => getCardioLibrary() },
    ],
    '/dashboard/trainer/ranking': (userId) => [
        ...getGlobalTrainerConfigs(userId),
    ],
    '/dashboard/trainer/import-pdf': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.trainer.students(userId), queryFn: () => getTrainerStudents() },
    ],
    // Dynamic match for student details - handled by middleware/layout logic that picks the right config
    '/dashboard/trainer/students/[id]': (userId) => [
        ...getGlobalTrainerConfigs(userId),
        { queryKey: QUERY_KEYS.workouts.today(userId), queryFn: () => getTodayWorkout(userId) },
        { queryKey: QUERY_KEYS.workouts.all(userId), queryFn: () => getAssignedWorkouts(userId) },
        { queryKey: QUERY_KEYS.diets.today(userId), queryFn: () => getStudentDailyDiet(userId) },
        { queryKey: QUERY_KEYS.diets.all(userId), queryFn: () => getAssignedDiets(userId) },
        { queryKey: QUERY_KEYS.cardio.today(userId), queryFn: () => getTodayCardio(userId) },
        { queryKey: QUERY_KEYS.cardio.all(userId), queryFn: () => getAssignedCardios(userId) },
        { queryKey: QUERY_KEYS.ergogenics.all(userId), queryFn: () => getStudentErgogenics(userId) },
        { queryKey: QUERY_KEYS.ergogenics.logs(userId), queryFn: () => getTodayErgogenicLogs(userId) },
    ]
};
