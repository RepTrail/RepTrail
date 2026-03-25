
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Crown, Medal, User } from 'lucide-react'

export default function StudentRankingLoading() {
    return (
        <div className="space-y-12 animate-pulse">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-zinc-800/50">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-8 bg-zinc-800 rounded-full" />
                        <Skeleton className="h-8 w-40 bg-zinc-800/50 rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-96 max-w-full bg-zinc-800/50 rounded-xl" />
                </div>
                <div className="h-14 w-60 rounded-2xl bg-zinc-900 border border-zinc-800" />
            </div>

            {/* Top 3 Podium */}
            <div className="grid gap-8 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] p-10 flex flex-col items-center text-center space-y-8 h-[550px] relative overflow-hidden backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            {i === 1 ? <Crown className="w-32 h-32" /> : i === 2 ? <Medal className="w-32 h-32" /> : <Trophy className="w-32 h-32" />}
                        </div>

                        <div className="relative z-10 w-full flex flex-col items-center gap-6">
                            <div className="h-32 w-32 rounded-full border-4 border-zinc-950 bg-zinc-950 shadow-2xl relative overflow-hidden">
                                <Skeleton className="absolute inset-0 w-full h-full bg-zinc-800/40" />
                            </div>
                            <div className="space-y-3 w-full flex flex-col items-center">
                                <Skeleton className="h-8 w-3/4 bg-zinc-800/50 rounded-xl" />
                                <Skeleton className="h-3 w-32 bg-zinc-800/30 rounded-md" />
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-7 w-20 rounded-xl bg-zinc-950 border border-zinc-800" />
                                <Skeleton className="h-7 w-16 rounded-xl bg-zinc-950 border border-zinc-800" />
                            </div>
                        </div>

                        <div className="w-full pt-8 border-t border-zinc-800/50 grid grid-cols-2 gap-6 mt-auto">
                            <div className="space-y-2 flex flex-col items-start px-2">
                                <Skeleton className="h-2 w-12 bg-zinc-800/50" />
                                <Skeleton className="h-6 w-16 bg-zinc-800/30" />
                            </div>
                            <div className="space-y-2 flex flex-col items-end px-2">
                                <Skeleton className="h-2 w-12 bg-zinc-800/50" />
                                <Skeleton className="h-6 w-16 bg-zinc-800/30" />
                            </div>
                        </div>

                        <div className="w-full h-16 rounded-2xl bg-zinc-800/30 border border-zinc-800/50" />
                    </div>
                ))}
            </div>

            {/* General List */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 pb-4px-2">
                    <User className="w-4 h-4 text-zinc-800" />
                    <Skeleton className="h-4 w-48 bg-zinc-800/50 rounded-md" />
                </div>

                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] overflow-hidden backdrop-blur-sm">
                    <div className="divide-y divide-zinc-800/50">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center p-6 md:p-8 gap-6 md:gap-8">
                                <Skeleton className="h-8 w-8 bg-zinc-800/50 rounded-lg flex-shrink-0" />
                                <Skeleton className="h-14 w-14 rounded-full bg-zinc-800/50 border-2 border-zinc-950 flex-shrink-0" />
                                <div className="flex-1 space-y-3 min-w-0">
                                    <Skeleton className="h-6 w-48 bg-zinc-800/50 rounded-lg" />
                                    <div className="flex gap-4">
                                        <Skeleton className="h-3 w-20 bg-zinc-800/30" />
                                        <Skeleton className="h-3 w-24 bg-zinc-800/30" />
                                    </div>
                                </div>
                                <div className="hidden md:flex flex-col items-center gap-2  border-l border-zinc-800/50">
                                    <Skeleton className="h-2 w-10 bg-zinc-800/50" />
                                    <Skeleton className="h-6 w-12 bg-zinc-800/30" />
                                </div>
                                <div className="hidden md:block">
                                    <Skeleton className="h-12 w-36 rounded-2xl bg-zinc-800/40 border border-zinc-800/50" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
