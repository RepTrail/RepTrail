import { Skeleton } from "@/components/ui/skeleton"
import { WorkoutCard } from '@/components/feature/student/dashboard/workout-card'
import { CardioCard } from '@/components/feature/student/dashboard/cardio-card'
import { DietCard } from '@/components/feature/student/dashboard/diet-card'
import { ErgogenicsCard } from '@/components/feature/student/dashboard/ergogenics-card'

export default function StudentDashboardLoading() {
    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-section-gap animate-in fade-in duration-500 pb-20">
            {/* Payment Warning Skeleton (Placeholder height) */}
            <div className="w-full h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50" />

            {/* Welcome Header Skeleton - Matches Page Header exactly */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-header-gap">
                <div className="space-y-4">
                    <Skeleton className="h-9 w-48 rounded-xl bg-zinc-900" />
                </div>
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 w-32">
                    <Skeleton className="h-2 w-10 bg-zinc-800 mb-2" />
                    <Skeleton className="h-3 w-24 bg-zinc-800" />
                </div>
            </div>

            <div className="grid gap-section-gap lg:grid-cols-12">
                {/* Main Content (Workout, Cardio & Ergos) */}
                <div className="lg:col-span-8 flex flex-col gap-section-gap">
                    <WorkoutCard.Skeleton />
                    <CardioCard.Skeleton />
                    <ErgogenicsCard.Skeleton />
                </div>

                {/* Sidebar (Diet) */}
                <div className="lg:col-span-4 flex flex-col gap-section-gap">
                    <DietCard.Skeleton />
                </div>
            </div>
        </div>
    )
}
