
import { Skeleton } from "@/components/ui/skeleton"

export default function RankingLoading() {
    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2 pb-2 border-b border-zinc-800/50">
                <div className="flex items-center gap-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-10 w-64" />
                </div>
                <Skeleton className="h-4 w-96" />
            </div>

            {/* Top 3 Podium */}
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center text-center space-y-6 h-[400px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Skeleton className="w-24 h-24 rounded-full" />
                        </div>

                        <div className="flex flex-col items-center gap-4 pt-4 relative z-10 w-full">
                            <Skeleton className="h-24 w-24 rounded-full border-4 border-zinc-900" />
                            <div className="space-y-2 w-full flex flex-col items-center">
                                <Skeleton className="h-6 w-3/4" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                    <Skeleton className="h-5 w-12 rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div className="w-full pt-6 border-t border-zinc-900 grid grid-cols-2 gap-4">
                            <div className="space-y-1 flex flex-col items-center">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                            <div className="space-y-1 flex flex-col items-center">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-6 w-12" />
                            </div>
                        </div>

                        <Skeleton className="w-full h-12 rounded-2xl mt-auto" />
                    </div>
                ))}
            </div>

            {/* List for 4 - 500 */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden border-t-zinc-700/10">
                <div className="bg-zinc-900/10 border-b border-zinc-900/50 py-4 px-6 flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <div className="divide-y divide-zinc-900">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center p-6 gap-4">
                            <Skeleton className="h-6 w-8 shrink-0" />
                            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <div className="hidden sm:block text-center px-4 space-y-1">
                                <Skeleton className="h-2 w-16" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                            <div className="text-right px-4 space-y-1">
                                <Skeleton className="h-2 w-16" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                            <Skeleton className="h-10 w-28 rounded-xl" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
