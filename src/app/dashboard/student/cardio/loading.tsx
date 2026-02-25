
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Activity, Timer, History, Flame, Zap } from 'lucide-react'

export default function StudentCardioLoading() {
    return (
        <div className="space-y-12 pb-20 animate-pulse">
            {/* Header matches StudentCardioPage header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-900 rounded-xl">
                            <Activity className="w-5 h-5 text-zinc-800" />
                        </div>
                        <Skeleton className="h-10 w-64 rounded-xl bg-zinc-800/50" />
                    </div>
                    <Skeleton className="h-4 w-96 max-w-full bg-zinc-800/50" />
                </div>
            </header>

            <div className="grid gap-10 lg:grid-cols-12 px-4">
                <div className="lg:col-span-8 space-y-10">
                    {/* Pending Sessions Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <Timer className="w-4 h-4 text-zinc-800" />
                                <Skeleton className="h-3 w-40 bg-zinc-800/50" />
                            </div>
                        </div>

                        {/* CardioInfoCard Skeletons */}
                        <div className="grid gap-8">
                            {[1, 2].map((i) => (
                                <Card key={i} className="bg-zinc-900/40 border-zinc-800/50 shadow-2xl rounded-[2.5rem] overflow-hidden backdrop-blur-sm border-t-zinc-700/10">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                            <div className="space-y-4 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-zinc-950 rounded-2xl border border-zinc-800">
                                                        <Activity className="w-6 h-6 text-zinc-900" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Skeleton className="h-7 w-48 bg-zinc-800/50 rounded-lg" />
                                                        <div className="flex items-center gap-2">
                                                            <Skeleton className="h-2 w-16 bg-zinc-800/30" />
                                                            <Skeleton className="h-2 w-24 bg-zinc-800/30" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Skeleton className="h-8 w-24 rounded-xl bg-zinc-950 border border-zinc-800" />
                                                    <Skeleton className="h-8 w-16 rounded-xl bg-zinc-950 border border-zinc-800" />
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-center gap-2 p-4 bg-zinc-950/30 rounded-2xl border border-zinc-800/50 min-w-[80px]">
                                                <Flame className="w-4 h-4 text-zinc-900" />
                                                <Skeleton className="h-2 w-10 bg-zinc-800/30" />
                                                <Skeleton className="h-4 w-12 bg-zinc-800/50" />
                                            </div>
                                        </div>

                                        <div className="p-6 rounded-3xl bg-zinc-950/40 border border-zinc-800/50 space-y-3">
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-3.5 h-3.5 text-zinc-800" />
                                                <Skeleton className="h-2 w-32 bg-zinc-800/30" />
                                            </div>
                                            <div className="space-y-2 pl-4 border-l-2 border-zinc-800">
                                                <Skeleton className="h-3 w-full bg-zinc-800/20" />
                                                <Skeleton className="h-3 w-3/4 bg-zinc-800/20" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-2">
                            <History className="w-4 h-4 text-zinc-800" />
                            <Skeleton className="h-3 w-32 bg-zinc-800/50" />
                        </div>
                        <Card className="bg-zinc-900/40 border-zinc-800/50 rounded-[2.5rem] p-8 backdrop-blur-sm shadow-xl space-y-6">
                            {[1, 2].map((i) => (
                                <div key={i} className="space-y-3">
                                    <Skeleton className="h-2 w-20 bg-zinc-800/50" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-full bg-zinc-800/20" />
                                        <Skeleton className="h-3 w-full bg-zinc-800/20" />
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-zinc-800 flex items-center gap-2">
                                <Flame className="w-4 h-4 text-zinc-800" />
                                <Skeleton className="h-2 w-24 bg-zinc-800/50" />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
