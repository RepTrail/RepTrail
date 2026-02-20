
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentProgressLoading() {
    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-10">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-zinc-800 rounded-full" />
                    <Skeleton className="h-12 w-64" />
                </div>
                <Skeleton className="h-4 w-96 max-w-full" />
            </div>

            {/* Metrics */}
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

            {/* Photo Upload Section */}
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] p-10 space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-40 w-full rounded-2xl" />
            </div>

            {/* Gallery Section */}
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] p-10 space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-3 w-48" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="aspect-[3/4] w-full rounded-2xl" />
                    ))}
                </div>
            </div>

            {/* Workout History */}
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] p-10 space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-3 w-64" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 w-full rounded-2xl bg-zinc-900/50 flex items-center p-4 gap-4">
                            <Skeleton className="w-8 h-8 rounded-lg" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-2 w-24" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Skeleton */}
            <div className="space-y-10">
                <Skeleton className="w-full h-[400px] rounded-[2.5rem]" />
                <Skeleton className="w-full h-[300px] rounded-[2.5rem]" />
            </div>
        </div>
    )
}
