import { QUERY_KEYS } from "./query-keys";
import { getStudentProfile, getStudentTrainer, getStudentDetails } from "@/actions/student-actions";
import { getTodayWorkout, getAssignedWorkouts, getTrainerWorkouts } from "@/actions/workout-actions";
import { getTodayCardio, getAssignedCardios, getCardioLibrary, getCardioStatus, getActiveCardioSession } from "@/actions/cardio-actions";
import { getStudentDailyDiet, getAssignedDiets, getTrainerDiets } from "@/actions/diet-actions";
import { getStudentErgogenics, getTodayErgogenicLogs } from "@/actions/ergogenics-actions";
import { getMetricsSummary, getStudentFullMetrics } from "@/actions/metrics-actions";
import { getActiveWorkoutSession, getStudentWorkoutHistory } from "@/actions/log-actions";
import { getTrainerRanking } from "@/actions/trainer-actions";
import { getAdherenceHistory } from "@/actions/tracking-actions";
import { checkStudentHasProtocol } from "@/actions/ai-protocol-actions";

export type PrefetchConfig = {
    queryKey: any[];
    queryFn: () => Promise<any>;
};

export const PREFETCH_REGISTRY: Record<string, (userId: string) => PrefetchConfig[]> = {
    '/dashboard/student': (userId) => [
        { queryKey: QUERY_KEYS.workouts.today(userId), queryFn: () => getTodayWorkout(userId) },
        { queryKey: QUERY_KEYS.workouts.all(userId), queryFn: () => getAssignedWorkouts(userId) },
        { queryKey: QUERY_KEYS.cardio.today(userId), queryFn: () => getTodayCardio(userId) },
        { queryKey: QUERY_KEYS.cardio.all(userId), queryFn: () => getAssignedCardios(userId) },
        { queryKey: QUERY_KEYS.diets.today(userId), queryFn: () => getStudentDailyDiet(userId) },
        { queryKey: QUERY_KEYS.diets.all(userId), queryFn: () => getAssignedDiets(userId) },
        { queryKey: QUERY_KEYS.ergogenics.all(userId), queryFn: async () => { const res = await getStudentErgogenics(userId); return Array.isArray(res) ? res : (res as any).data || []; } },
        { queryKey: QUERY_KEYS.ergogenics.logs(userId), queryFn: () => getTodayErgogenicLogs(userId) },
        { queryKey: QUERY_KEYS.student.details(userId), queryFn: () => getStudentProfile(userId) },
        { queryKey: QUERY_KEYS.student.metricsSummary(userId), queryFn: () => getMetricsSummary(userId) },
        { queryKey: [...QUERY_KEYS.workouts.session], queryFn: () => getActiveWorkoutSession() },
        { queryKey: [...QUERY_KEYS.cardio.session], queryFn: () => getActiveCardioSession() },
        { queryKey: QUERY_KEYS.workouts.logs(userId), queryFn: () => getStudentWorkoutHistory(userId) },
        { queryKey: QUERY_KEYS.cardio.logs(userId), queryFn: () => getCardioStatus(userId) },
        { queryKey: QUERY_KEYS.student.hasProtocol(userId), queryFn: () => checkStudentHasProtocol(userId) },
        { queryKey: QUERY_KEYS.trainer.ranking(), queryFn: () => getTrainerRanking() },
    ],
    '/dashboard/student/workouts': (userId) => [
        { queryKey: QUERY_KEYS.workouts.all(userId), queryFn: () => getAssignedWorkouts(userId) },
        { queryKey: QUERY_KEYS.workouts.library(userId), queryFn: () => getTrainerWorkouts() },
    ],
    '/dashboard/student/cardio': (userId) => [
        { queryKey: QUERY_KEYS.cardio.all(userId), queryFn: () => getAssignedCardios(userId) },
        { queryKey: QUERY_KEYS.cardio.library(userId), queryFn: () => getCardioLibrary() },
    ],
    '/dashboard/student/diet': (userId) => [
        { queryKey: QUERY_KEYS.diets.today(userId), queryFn: () => getStudentDailyDiet(userId) },
        { queryKey: QUERY_KEYS.diets.all(userId), queryFn: () => getAssignedDiets(userId) },
        { queryKey: QUERY_KEYS.diets.library(userId), queryFn: () => getTrainerDiets() },
    ],
    '/dashboard/student/ergogenics': (userId) => [
        { queryKey: QUERY_KEYS.ergogenics.all(userId), queryFn: async () => { const res = await getStudentErgogenics(userId); return Array.isArray(res) ? res : (res as any).data || []; } },
        { queryKey: QUERY_KEYS.ergogenics.logs(userId), queryFn: () => getTodayErgogenicLogs(userId) },
    ],
    '/dashboard/student/profile': (userId) => [
        { queryKey: QUERY_KEYS.student.details(userId), queryFn: () => getStudentProfile(userId) },
        { queryKey: QUERY_KEYS.profile.trainer(userId), queryFn: () => getStudentTrainer(userId) },
    ],
    '/dashboard/student/progress': (userId) => [
        { queryKey: QUERY_KEYS.student.metricsSummary(userId), queryFn: () => getMetricsSummary(userId) },
        { queryKey: QUERY_KEYS.student.metrics(userId), queryFn: () => getStudentFullMetrics(userId) },
        { queryKey: QUERY_KEYS.student.activity(userId), queryFn: () => getStudentWorkoutHistory(userId) },
        { queryKey: ['adherence', 30], queryFn: () => getAdherenceHistory(30) }
    ],
    '/dashboard/student/anamnese': (userId) => [
        { queryKey: QUERY_KEYS.student.details(userId), queryFn: () => getStudentDetails(userId) }
    ],
    '/dashboard/student/ranking': () => [
        { queryKey: QUERY_KEYS.trainer.ranking(), queryFn: () => getTrainerRanking() }
    ],
    '/dashboard/student/meu-personal': (userId) => [
        { queryKey: QUERY_KEYS.profile.trainer(userId), queryFn: () => getStudentTrainer(userId) }
    ],
    '/dashboard/student/loja': () => []
};
