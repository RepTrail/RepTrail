
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, Camera, Images, History } from 'lucide-react'

export default function StudentProgressLoading() {
    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-32  sm:px-6 md:px-8 animate-pulse">
            {/* Header matches StudentProgressPage header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4">
                        <div className="p-2 bg-zinc-900 rounded-xl">
                            <TrendingUp className="w-5 h-5 text-zinc-800" />
                        </div>
                        <Skeleton className="h-10 w-64 rounded-xl bg-zinc-800/50" />
                    </div>
                    <Skeleton className="h-4 w-96 max-w-full bg-zinc-800/50" />
                </div>
            </header>

            {/* Stat Cards - Matches real layout */}
            <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl p-8 space-y-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-4 h-4 rounded bg-zinc-800/50" />
                            <Skeleton className="h-2 w-20 bg-zinc-800/50" />
                        </div>
                        <Skeleton className="h-8 w-16 bg-zinc-800/50" />
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-12 bg-zinc-950 rounded-lg" />
                            <Skeleton className="h-2 w-24 bg-zinc-800/50" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Photo Upload Section */}
            <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-2xl rounded-[3rem] p-6 space-y-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 pb-4">
                        <Camera className="w-6 h-6 text-zinc-800" />
                        <Skeleton className="h-6 w-48 bg-zinc-800/50" />
                    </div>
                    <Skeleton className="h-3 w-64 bg-zinc-800/50" />
                </div>
                <div className="aspect-[2/1] w-full rounded-2xl bg-zinc-950/50 border border-zinc-800/50" />
            </div>

            {/* Gallery Section */}
            <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-2xl rounded-[2.5rem] p-6 space-y-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 pb-4">
                        <Images className="w-6 h-6 text-zinc-800" />
                        <Skeleton className="h-6 w-32 bg-zinc-800/50" />
                    </div>
                    <Skeleton className="h-3 w-48 bg-zinc-800/50" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-[3/4] w-full rounded-2xl bg-zinc-950/50 border border-zinc-800/50" />
                    ))}
                </div>
            </div>

            {/* Workout History Card */}
            <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-2xl rounded-[2.5rem] p-6 space-y-8">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 pb-4">
                        <History className="w-6 h-6 text-zinc-800" />
                        <Skeleton className="h-6 w-56 bg-zinc-800/50" />
                    </div>
                    <Skeleton className="h-3 w-64 bg-zinc-800/50" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 w-full rounded-2xl bg-zinc-950/50 border border-zinc-900 flex items-center p-6 gap-6">
                            <Skeleton className="w-10 h-10 rounded-xl bg-zinc-800/50" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-3 w-48 bg-zinc-800/50" />
                                <Skeleton className="h-2 w-32 bg-zinc-800/50" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            <div className="space-y-10">
                <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-2xl rounded-[2.5rem] p-10 h-[400px]">
                    <Skeleton className="w-full h-full rounded-2xl bg-zinc-950/50" />
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800/50 shadow-2xl rounded-[2.5rem] p-10 h-[300px]">
                    <Skeleton className="w-full h-full rounded-2xl bg-zinc-950/50" />
                </div>
            </div>
        </div>
    )
}
