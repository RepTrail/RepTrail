
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, Utensils, Dumbbell, Syringe, ShieldCheck } from 'lucide-react'

export default function StudentDashboardLoading() {
    return (
        <div className="space-y-10 pb-20 animate-pulse">
            {/* Payment Warning Skeleton (Placeholder height) */}
            <div className="w-full h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50" />

            {/* Welcome Header Skeleton - Matches Page Header exactly */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <Skeleton className="h-10 w-48 rounded-xl" />
                        <Skeleton className="h-9 w-40 rounded-xl" />
                    </div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="h-3 w-48 rounded-md" />
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800/50">
                    <div className="px-4 py-2 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
                        <Skeleton className="h-2 w-10" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Main Content (Workout & Cardio) */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Workout Section Skeleton */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <Dumbbell className="w-4 h-4 text-zinc-800" />
                                <Skeleton className="h-4 w-32 rounded-md" />
                            </div>
                            <Skeleton className="h-3 w-20 rounded-md" />
                        </div>

                        {/* Workout Card Skeleton - Perfectly faithful to WorkoutCard */}
                        <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-xl p-8 rounded-[2.5rem] backdrop-blur-sm overflow-hidden h-[280px] relative">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                                <Dumbbell className="w-32 h-32" />
                            </div>
                            <div className="relative space-y-8">
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-3/4 rounded-xl" />
                                    <Skeleton className="h-3 w-48 rounded-md" />
                                </div>
                                <Skeleton className="h-12 w-40 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Cardio Section Skeleton */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <Activity className="w-4 h-4 text-zinc-800" />
                                <Skeleton className="h-4 w-32 rounded-md" />
                            </div>
                        </div>

                        {/* Cardio Card Skeleton - Perfectly faithful to CardioPlayer */}
                        <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-2xl border-t-zinc-700/10 p-8 rounded-[2.5rem] overflow-hidden backdrop-blur-sm space-y-8 min-h-[400px]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                                            <Activity className="w-5 h-5 text-zinc-800" />
                                        </div>
                                        <Skeleton className="h-6 w-40 rounded-lg" />
                                    </div>
                                    <div className="flex gap-2">
                                        <Skeleton className="h-4 w-16 rounded-md bg-zinc-800/20" />
                                        <Skeleton className="h-4 w-20 rounded-md bg-zinc-800/20" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center justify-center space-y-4">
                                <Skeleton className="h-2 w-24 bg-zinc-800" />
                                <Skeleton className="h-20 w-48 rounded-2xl bg-zinc-800/50" />
                                <Skeleton className="h-2 w-full max-w-xs rounded-full bg-zinc-800/20" />
                            </div>

                            <div className="flex items-center justify-center gap-6">
                                <Skeleton className="w-20 h-20 rounded-full bg-zinc-800/40" />
                                <Skeleton className="w-16 h-16 rounded-full bg-zinc-800/30" />
                            </div>

                            <div className="grid grid-cols-6 gap-3 p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-3xl">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className={`h-14 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 ${i <= 3 ? 'col-span-3 sm:col-span-2' : i === 4 ? 'col-span-6 sm:col-span-3' : 'col-span-6 sm:col-span-3'}`} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Ergogenics Section Skeleton */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <Syringe className="w-4 h-4 text-zinc-800" />
                                <Skeleton className="h-4 w-40 bg-zinc-800/50 rounded-md" />
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            {[1, 2].map((i) => (
                                <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 shadow-xl p-6 rounded-[2rem] backdrop-blur-sm space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-5 w-32 bg-zinc-800/50" />
                                            <Skeleton className="h-2 w-20 bg-zinc-800/30" />
                                        </div>
                                        <Skeleton className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800" />
                                    </div>
                                    <div className="pt-4 border-t border-zinc-800/50">
                                        <Skeleton className="h-2 w-full bg-zinc-800/10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar (Diet & Info) */}
                <div className="lg:col-span-4 space-y-10">

                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <Utensils className="w-4 h-4 text-zinc-800" />
                            <Skeleton className="h-4 w-32 rounded-md" />
                        </div>

                        {/* Diet Card Skeleton - Perfectly faithful to DietAdherence */}
                        <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-2xl border-t-zinc-700/10 rounded-[2.5rem] p-8 space-y-8 min-h-[500px]">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Utensils className="w-4 h-4 text-zinc-800" />
                                            <Skeleton className="h-5 w-32" />
                                        </div>
                                        <Skeleton className="h-3 w-40" />
                                    </div>
                                    <Skeleton className="h-8 w-12 rounded-lg" />
                                </div>
                                <Skeleton className="h-3 w-full rounded-full" />
                            </div>

                            <div className="grid grid-cols-6 gap-3 p-4 bg-zinc-950/30 border border-zinc-800/50 rounded-3xl">
                                <div className="h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-2" />
                                <div className="h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-2" />
                                <div className="h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-2" />
                                <div className="h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50 col-span-3 sm:col-span-3" />
                                <div className="h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50 col-span-6 sm:col-span-3" />
                            </div>

                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-zinc-950/20 border border-zinc-900">
                                        <div className="flex items-center gap-4">
                                            <Skeleton className="w-10 h-10 rounded-2xl" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-3 w-24" />
                                                <Skeleton className="h-2 w-32" />
                                            </div>
                                        </div>
                                        <Skeleton className="w-5 h-5 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
