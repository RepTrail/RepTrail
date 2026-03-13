import { getStudentWorkoutHistory } from '@/actions/log-actions'
import { StudentWorkoutHistory } from '@/components/feature/trainer/student-workout-history'
import { History } from 'lucide-react'

export async function WorkoutHistorySection({ studentId }: { studentId: string }) {
    const history = await getStudentWorkoutHistory(studentId)

    return (
        <div className="space-y-6 mb-16">
            <div className="flex items-center gap-3 pb-4 px-2">
                <History className="w-6 h-6 text-emerald-500" />
                <h2 className="text-xl font-black italic uppercase tracking-tight">Histórico de Treinos</h2>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden backdrop-blur-sm p-4 sm:p-6 md:p-10">
                <StudentWorkoutHistory
                    history={history as any}
                    isBlocked={false}
                    mode="student"
                />
            </div>
        </div>
    )
}
