
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentDashboardLoading() {
    return (
        <div className="space-y-10 pb-20">
            {/* Payment Warning Skeleton */}
            <div className="w-full h-12 rounded-xl bg-zinc-900/50 border border-zinc-800/50" />

            {/* Welcome Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4 w-full md:w-auto">
                    <Skeleton className="h-10 w-48 md:w-64" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
                <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-2xl border border-zinc-800/50 w-full md:w-auto">
                    <div className="px-4 py-2 bg-zinc-950 rounded-xl border border-zinc-800 w-full md:w-40 space-y-2">
                        <Skeleton className="h-2 w-10" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Main Content (Workout & Cardio) */}
                <div className="lg:col-span-8 space-y-10">

                    {/* Workout Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <Skeleton className="h-3 w-32" />
                        </div>

                        {/* Workout Card Skeleton */}
                        <div className="relative bg-zinc-900/40 border border-zinc-800/50 p-8 rounded-[2.5rem] backdrop-blur-sm overflow-hidden h-[280px]">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Skeleton className="w-32 h-32 rounded-full" />
                            </div>
                            <div className="relative space-y-8">
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <Skeleton className="h-12 w-40 rounded-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Cardio Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <Skeleton className="h-3 w-32" />
                        </div>

                        {/* Cardio Card Skeleton */}
                        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-[2.5rem] h-[180px] flex items-center justify-center">
                            <div className="text-center space-y-4 w-full max-w-xs flex flex-col items-center">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-2 w-48" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar (Diet & Info) */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <Skeleton className="h-3 w-24" />
                        </div>

                        {/* Diet Card Skeleton (Longer) */}
                        <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] p-8 h-[500px] space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="w-12 h-12 rounded-full" />
                            </div>

                            <div className="space-y-4 pt-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                                        <div className="space-y-2 w-full pt-1">
                                            <Skeleton className="h-3 w-full" />
                                            <Skeleton className="h-2 w-2/3" />
                                        </div>
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
