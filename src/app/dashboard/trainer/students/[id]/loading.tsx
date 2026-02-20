
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentDetailLoading() {
    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-6 pb-2 border-b border-zinc-800/50">
                <Skeleton className="h-4 w-32" />
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-14 w-14 md:h-16 md:w-16 rounded-full shrink-0" />
                        <div className="space-y-2 min-w-0">
                            <Skeleton className="h-8 w-48 md:w-64" />
                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-5 w-16 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Action Bar Skeleton */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                    <Skeleton className="h-10 w-24 rounded-xl" />
                    <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-5 space-y-3">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-4 w-4" />
                        </div>
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 md:grid-cols-3">

                {/* Profile Info - Secondary Data */}
                <div className="md:col-span-1 bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm p-6 space-y-8 h-[500px]">
                    <Skeleton className="h-4 w-40" />
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                        ))}
                    </div>
                    <div className="pt-8 border-t border-zinc-800/50 space-y-5">
                        <Skeleton className="h-4 w-24" />
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-full rounded-2xl" />
                            <Skeleton className="h-12 w-full rounded-2xl" />
                        </div>
                    </div>
                </div>

                {/* Assigned Content */}
                <div className="md:col-span-2 space-y-10">
                    <div className="space-y-10">
                        <div className="grid gap-8 lg:grid-cols-2">
                            {/* Workouts Section */}
                            <div className="space-y-5">
                                <div className="flex items-center justify-between px-2">
                                    <Skeleton className="h-4 w-32" />
                                </div>
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-5 h-20 flex items-center gap-4">
                                            <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
                                            <div className="space-y-2 w-full">
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Diet Section */}
                            <div className="space-y-5">
                                <Skeleton className="h-4 w-32 px-2" />
                                <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-5 h-20 flex items-center gap-4">
                                    <Skeleton className="w-11 h-11 rounded-2xl shrink-0" />
                                    <div className="space-y-2 w-full">
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cardio Section - Full Width */}
                        <div className="w-full">
                            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-6 h-40 space-y-4">
                                <Skeleton className="h-4 w-32" />
                                <div className="flex gap-4">
                                    <Skeleton className="w-12 h-12 rounded-2xl" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-3 w-32" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2">
                        {/* Last Activity Card */}
                        <div className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden p-6 space-y-4 h-[200px]">
                            <Skeleton className="h-4 w-40" />
                            <div className="flex items-center gap-5 pt-4">
                                <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-5 w-48" />
                                </div>
                            </div>
                        </div>

                        {/* Photo History Card */}
                        <div className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-3xl overflow-hidden p-6 space-y-4 h-[200px]">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-7 w-20 rounded-xl" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="w-20 h-24 rounded-2xl shrink-0" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Skeleton */}
            <div className="space-y-10 mt-10">
                <Skeleton className="w-full h-[400px] rounded-[2.5rem]" />
                <Skeleton className="w-full h-[300px] rounded-[2.5rem]" />
            </div>
        </div>
    )
}
