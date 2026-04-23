/**
 * Centralized Query Keys for TanStack Query (Local-First Pattern)
 * 
 * Hierarchy Enforcement:
 * - resource.all(userId): ['resource', userId]
 * - resource.today(userId): ['resource', userId, 'today']
 * - resource.detail(id): ['resource', id]
 */

export const QUERY_KEYS = {
    auth: {
        session: ['auth', 'session'],
        user: ['auth', 'user'],
    },
    profile: {
        detail: (userId: string) => ['profile', userId],
        trainer: (studentId: string) => ['profile', studentId, 'trainer'],
    },
    student: {
        details: (userId: string) => ['student', userId, 'details'],
        metrics: (userId: string) => ['student', userId, 'metrics'],
        anamnesis: (userId: string) => ['student', userId, 'anamnesis'],
        ranking: ['student', 'ranking'],
        metricsSummary: (userId: string) => ['student', userId, 'metricsSummary'],
        activeSession: (userId: string) => ['student', userId, 'activeSession'],
        activity: (userId: string) => ['student', userId, 'activity'],
        photos: (userId: string) => ['student', userId, 'photos'],
    },
    workouts: {
        all: (userId: string) => ['workouts', userId],
        assignments: (userId: string) => ['workouts', userId],
        today: (userId: string) => ['workouts', userId, 'today'],
        detail: (workoutId: string) => ['workouts', workoutId],
        status: (userId: string, workoutId?: string) => ['workouts', userId, 'status', workoutId],
        logs: (userId: string) => ['workouts', userId, 'logs'],
        library: (userId: string) => ['workouts', userId, 'library'],
        session: ['active-workout-session'],
    },
    diets: {
        all: (userId: string) => ['diets', userId],
        assignments: (userId: string) => ['diets', userId],
        today: (userId: string) => ['diets', userId, 'today'],
        detail: (dietId: string) => ['diets', dietId],
        library: (userId: string) => ['diets', userId, 'library'],
    },
    cardio: {
        all: (userId: string) => ['cardio', userId],
        assignments: (studentId: string) => ['cardio', studentId, 'assignments'],
        today: (userId: string) => ['cardio', userId, 'today'],
        detail: (cardioId: string) => ['cardio', cardioId],
        logs: (userId: string) => ['cardio', userId, 'logs'],
        library: (userId: string) => ['cardio', userId, 'library'],
        session: ['active-cardio-session'],
    },
    ergogenics: {
        all: (userId: string) => ['ergogenics', userId],
        logs: (userId: string) => ['ergogenics', userId, 'logs'],
    },
    store: {
        products: ['store', 'products'],
        clicks: ['store', 'clicks'],
    },
    admin: {
        overview: ['admin', 'overview'],
        trainers: ['admin', 'trainers'],
        students: ['admin', 'students'],
        affiliates: ['admin', 'affiliates'],
        payouts: ['admin', 'payouts'],
        logs: ['admin', 'logs'],
        costs: ['admin', 'costs'],
        activity: ['admin', 'activity'],
    },
    player: {
        workout: (workoutId: string) => ['player', 'workout', workoutId],
        cardio: (cardioId: string) => ['player', 'cardio', cardioId],
    },
    search: {
        trainers: (filters: any) => ['search', 'trainers', filters],
    },
    trainer: {
        students: (trainerId: string) => ['trainer', trainerId, 'students'],
        activity: (trainerId: string) => ['trainer', trainerId, 'activity'],
        profile: (trainerId: string) => ['trainer', trainerId, 'profile'],
        effectiveTier: (trainerId: string) => ['trainer', trainerId, 'effectiveTier'],
        studentDetail: (studentId: string) => ['trainer', 'student', studentId],
        studentHistory: (studentId: string) => ['trainer', 'student', studentId, 'history'],
        studentMetrics: (studentId: string) => ['trainer', 'student', studentId, 'metrics'],
        studentAdherence: (studentId: string) => ['trainer', 'student', studentId, 'adherence'],
        studentChartData: (studentId: string) => ['trainer', 'student', studentId, 'chart'],
        ranking: () => ['trainer', 'ranking'],
    },
    public: {
        feed: ['public', 'feed']
    }
} as const
