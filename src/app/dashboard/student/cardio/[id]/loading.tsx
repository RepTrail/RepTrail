
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, ArrowLeft, AlignLeft, Clock, Zap } from 'lucide-react'

export default function CardioBuilderLoading() {
    return (
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-10 animate-pulse">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-2xl">
                        <Activity className="w-5 h-5 text-zinc-800" />
                    </div>
                    <Skeleton className="h-10 w-64 bg-zinc-800/50 rounded-xl" />
                </div>
                <Skeleton className="h-3 w-48 bg-zinc-800/30 rounded-md" />
            </div>

            {/* Description */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <AlignLeft className="w-4 h-4 text-zinc-800" />
                    <Skeleton className="h-3 w-32 bg-zinc-800/50 rounded" />
                </div>
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 min-h-[140px]">
                    <Skeleton className="h-3 w-full bg-zinc-800/20 rounded" />
                    <Skeleton className="h-3 w-2/3 bg-zinc-800/20 rounded mt-2" />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-2">
                            {i === 1 ? <Clock className="w-4 h-4 text-zinc-800" /> : <Zap className="w-4 h-4 text-zinc-800" />}
                            <Skeleton className="h-3 w-32 bg-zinc-800/50 rounded" />
                        </div>
                        <Skeleton className="h-12 w-full bg-zinc-950 border border-zinc-800 rounded-xl" />
                    </div>
                ))}
            </div>

            {/* Info Box */}
            <div className="bg-zinc-900/20 border border-zinc-800/30 rounded-2xl p-4 flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg">
                    <Activity className="w-4 h-4 text-zinc-800" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-3 w-24 bg-zinc-800/50 rounded" />
                    <Skeleton className="h-2 w-64 bg-zinc-800/30 rounded" />
                </div>
            </div>

            {/* Back Button */}
            <div className="pt-10 flex justify-center border-t border-zinc-800/30">
                <div className="flex items-center gap-2 text-zinc-800">
                    <ArrowLeft className="w-4 h-4" />
                    <Skeleton className="h-4 w-48 bg-zinc-800/30 rounded-md" />
                </div>
            </div>
        </div>
    )
}
