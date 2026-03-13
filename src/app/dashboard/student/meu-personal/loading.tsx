
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { UserCheck, Trophy } from 'lucide-react'

export default function MeuPersonalLoading() {
    return (
        <div className="space-y-10 pb-20 animate-pulse">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 mb-2">
                    <div className="p-2 bg-zinc-900 rounded-xl">
                        <UserCheck className="w-5 h-5 text-zinc-800" />
                    </div>
                    <Skeleton className="h-10 w-64 rounded-xl bg-zinc-800/50" />
                </div>
                <div className="flex items-center gap-2">
                    <UserCheck className="w-3 h-3 text-zinc-800" />
                    <Skeleton className="h-3 w-40 bg-zinc-800/50" />
                </div>
            </div>

            {/* Trainer Hero Card Skeleton */}
            <div className="relative p-8 md:p-12 bg-zinc-900/50 border border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center md:items-start">
                    {/* Avatar Skeleton */}
                    <div className="relative shrink-0">
                        <Skeleton className="w-40 h-40 rounded-full bg-zinc-800/50 border-4 border-zinc-900 shadow-xl" />
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-zinc-950 border border-zinc-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg z-20">
                            <Trophy className="w-3.5 h-3.5 text-zinc-800" />
                            <Skeleton className="h-2 w-16 bg-zinc-800/50" />
                        </div>
                    </div>

                    {/* Info Skeleton */}
                    <div className="flex-1 space-y-6 text-center md:text-left w-full">
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-3/4 md:w-1/2 mx-auto md:mx-0 bg-zinc-800/50 rounded-xl" />
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <Skeleton className="h-4 w-24 bg-zinc-800/50" />
                                <Skeleton className="h-4 w-28 bg-zinc-800/50" />
                                <Skeleton className="h-4 w-32 bg-zinc-800/50" />
                            </div>
                        </div>

                        <div className="space-y-2 max-w-xl mx-auto md:mx-0">
                            <Skeleton className="h-3 w-full bg-zinc-800/50" />
                            <Skeleton className="h-3 w-full bg-zinc-800/50" />
                            <Skeleton className="h-3 w-2/3 bg-zinc-800/50" />
                        </div>

                        <Skeleton className="h-6 w-32 mx-auto md:mx-0 bg-zinc-800/50 rounded-lg" />

                        {/* CTA Skeleton */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center md:justify-start">
                            <Skeleton className="h-14 w-full sm:w-48 rounded-2xl bg-zinc-800/50" />
                            <Skeleton className="h-14 w-full sm:w-48 rounded-2xl bg-zinc-800/50" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Plan Info Grid Skeleton */}
            <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden">
                        <CardContent className="p-8 space-y-4">
                            <Skeleton className="w-12 h-12 rounded-xl bg-zinc-800/50" />
                            <div className="space-y-2">
                                <Skeleton className="h-2 w-12 bg-zinc-800/50" />
                                <Skeleton className="h-5 w-32 bg-zinc-800/50" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Plan Details Skeleton */}
            <div className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-[2.5rem] space-y-6">
                <Skeleton className="h-2 w-32 bg-zinc-800/50" />
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
                        <Skeleton className="h-2 w-16 bg-zinc-800/50" />
                        <Skeleton className="h-6 w-24 bg-zinc-800/50" />
                    </div>
                    <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
                        <Skeleton className="h-2 w-16 bg-zinc-800/50" />
                        <Skeleton className="h-6 w-24 bg-zinc-800/50" />
                    </div>
                </div>
            </div>
        </div>
    )
}
