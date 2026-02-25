
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Clock, FlaskConical, History } from 'lucide-react'

export default function StudentErgogenicsLoading() {
    return (
        <div className="space-y-12 pb-20 animate-pulse">
            {/* 1. Main Header - Matches Page.tsx exactly */}
            <div className="space-y-4 px-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-zinc-900 rounded-xl">
                        <Activity className="w-5 h-5 text-zinc-800" />
                    </div>
                    <Skeleton className="h-10 w-64 rounded-xl bg-zinc-800/50" />
                </div>
                <Skeleton className="h-3 w-80 bg-zinc-800/50 rounded-md" />
            </div>

            {/* 2. Sub Header - Matches Page.tsx exactly */}
            <div className="flex flex-col gap-2 pb-2 border-b border-zinc-800/50 mx-4">
                <Skeleton className="h-10 w-48 bg-zinc-800/50 rounded-xl" />
                <Skeleton className="h-3 w-80 bg-zinc-800/50 rounded-md" />
            </div>

            <div className="px-4 space-y-12">
                {/* 3. Today's Applications Section */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Clock className="w-6 h-6 text-zinc-800" />
                            <Skeleton className="h-8 w-64 bg-zinc-800/50 rounded-lg" />
                        </div>
                        <Skeleton className="h-2 w-64 bg-zinc-800/30" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <Card key={i} className="bg-zinc-950 border-emerald-500/10 rounded-3xl overflow-hidden shadow-2xl">
                                <CardContent className="p-0">
                                    <div className="p-6 bg-zinc-900/40 border-b border-zinc-900/50 flex items-center justify-between">
                                        <div className="space-y-2">
                                            <Skeleton className="h-6 w-40 bg-zinc-800/50 rounded-md" />
                                            <Skeleton className="h-2 w-28 bg-emerald-500/20" />
                                        </div>
                                        <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                                            <Skeleton className="w-6 h-6 rounded bg-zinc-800/50" />
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div className="space-y-3">
                                            <Skeleton className="h-2 w-24 bg-zinc-800/50" />
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                                                    <div key={d} className="w-6 h-6 rounded-md bg-zinc-950 border border-zinc-900" />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-zinc-900 space-y-3">
                                            <Skeleton className="h-2 w-16 bg-zinc-800/50" />
                                            <div className="space-y-2">
                                                <Skeleton className="h-3 w-full bg-zinc-800/20" />
                                                <Skeleton className="h-3 w-2/3 bg-zinc-800/20" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 4. Rest of the Protocol Section */}
                <div className="space-y-6 opacity-60">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-zinc-800" />
                            <Skeleton className="h-6 w-56 bg-zinc-800/50 rounded-lg" />
                        </div>
                        <Skeleton className="h-2 w-64 bg-zinc-800/30" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="bg-zinc-950 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
                            <div className="p-6 bg-zinc-900/40 border-b border-zinc-900/50">
                                <Skeleton className="h-6 w-32 bg-zinc-800/50 rounded-md" />
                            </div>
                            <div className="p-6">
                                <Skeleton className="h-2 w-20 bg-zinc-800/50 mb-3" />
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                                        <div key={d} className="w-6 h-6 rounded-md bg-zinc-950 border border-zinc-900" />
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* 5. History Section */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <History className="w-5 h-5 text-zinc-800" />
                            <Skeleton className="h-6 w-64 bg-zinc-800/50 rounded-lg" />
                        </div>
                        <Skeleton className="h-2 w-80 bg-zinc-800/30" />
                    </div>

                    <Card className="bg-zinc-950 border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl">
                        <div className="divide-y divide-zinc-900">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 flex-shrink-0">
                                            <FlaskConical className="w-4 h-4 text-zinc-800 opacity-20" />
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-3.5 w-40 bg-zinc-800/50" />
                                            <Skeleton className="h-2 w-24 bg-zinc-800/30" />
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <Skeleton className="h-3 w-20 bg-zinc-800/50 ml-auto" />
                                        <Skeleton className="h-2 w-14 bg-zinc-800/30 ml-auto" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
