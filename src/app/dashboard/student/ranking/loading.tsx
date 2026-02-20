
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentRankingLoading() {
    return (
        <div className="space-y-12 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
                <div className="space-y-4">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-10 w-96 max-w-full" />
                </div>
                <Skeleton className="h-14 w-60 rounded-2xl" />
            </div>

            {/* Top 3 Podium */}
            <div className="grid gap-8 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-[3rem] p-10 flex flex-col items-center text-center space-y-8 h-[550px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Skeleton className="w-32 h-32 rounded-full" />
                        </div>

                        <div className="relative z-10 w-full flex flex-col items-center gap-6">
                            <Skeleton className="h-32 w-32 rounded-full border-4 border-zinc-900 shadow-2xl" />
                            <div className="space-y-3 w-full flex flex-col items-center">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-20 rounded-lg" />
                                <Skeleton className="h-6 w-16 rounded-lg" />
                            </div>
                        </div>

                        <div className="w-full pt-8 border-t border-zinc-900 grid grid-cols-2 gap-6 mt-auto">
                            <div className="space-y-2 flex flex-col items-start">
                                <Skeleton className="h-2 w-12" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                            <div className="space-y-2 flex flex-col items-end">
                                <Skeleton className="h-2 w-12" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </div>

                        <Skeleton className="w-full h-14 rounded-2xl" />
                    </div>
                ))}
            </div>

            {/* General List */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 px-2">
                    <Skeleton className="w-4 h-4 rounded-full" />
                    <Skeleton className="h-3 w-48" />
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                    <div className="divide-y divide-zinc-800/50">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center p-4 md:p-8 gap-4 md:gap-6">
                                <Skeleton className="h-8 w-8 md:w-16 shrink-0" />
                                <Skeleton className="h-10 w-10 md:h-16 md:w-16 rounded-full shrink-0" />
                                <div className="flex-1 space-y-2 min-w-0">
                                    <Skeleton className="h-6 w-48" />
                                    <div className="flex gap-3">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <div className="hidden md:block text-center space-y-1 ml-6">
                                    <Skeleton className="h-2 w-12" />
                                    <Skeleton className="h-6 w-8" />
                                </div>
                                <div className="hidden md:block ml-6">
                                    <Skeleton className="h-12 w-32 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
