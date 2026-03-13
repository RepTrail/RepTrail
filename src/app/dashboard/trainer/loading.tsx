
import { Skeleton } from "@/components/ui/skeleton"

export default function TrainerDashboardLoading() {
    return (
        <div className="space-y-10 pb-10">
            {/* Code Generator Skeleton */}
            <div className="w-full h-16 bg-zinc-900/50 rounded-xl border border-zinc-800/50" />

            {/* Hero Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center gap-3 pb-4">
                    <Skeleton className="h-11 w-32 rounded-xl" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-800 shadow-xl rounded-2xl overflow-hidden p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-5 w-5 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-16" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Main Content Area */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Activity Feed Skeleton */}
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-6 h-[400px]">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-8 w-8 rounded-lg" />
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                                    <div className="space-y-2 w-full pt-1">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-3 w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-zinc-950 border border-zinc-800 shadow-xl rounded-2xl overflow-hidden p-6 flex flex-col items-center text-center space-y-4">
                                <Skeleton className="w-16 h-16 rounded-2xl" />
                                <div className="space-y-2 w-full flex flex-col items-center">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                                <Skeleton className="h-9 w-24 rounded-xl mt-2" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar area */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="rounded-2xl overflow-hidden shadow-2xl space-y-4 bg-zinc-950 border border-zinc-800 p-6 h-[300px]">
                        <Skeleton className="h-20 w-full rounded-xl" />
                        <Skeleton className="h-9 w-full rounded-xl" />
                        <div className="pt-4 space-y-4 border-t border-zinc-800/50">
                            <div className="flex justify-between items-center">
                                <Skeleton className="w-10 h-10 rounded-full" />
                                <div className="space-y-2 flex-1 ml-4">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden p-6 space-y-4 h-[200px]">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-16 w-full rounded-xl" />
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}
