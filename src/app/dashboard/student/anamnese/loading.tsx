
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ClipboardList, Activity } from 'lucide-react'

export default function AnamnesisLoading() {
    return (
        <div className="space-y-10 pb-20 animate-pulse">
            {/* Header matches AnamnesisPage header */}
            <div className="flex items-center gap-3 pb-4mb-2">
                <div className="p-2 bg-zinc-900 rounded-xl">
                    <ClipboardList className="w-5 h-5 text-zinc-800" />
                </div>
                <Skeleton className="h-10 w-80 rounded-xl bg-zinc-800/50" />
            </div>
            <Skeleton className="h-4 w-96 max-w-full bg-zinc-800/50" />

            {/* AnamnesisForm Card Skeleton */}
            <Card className="bg-zinc-950 border-zinc-900 shadow-2xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="p-8 md:p-12 border-b border-zinc-900 bg-zinc-900/10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 pb-4">
                                <div className="p-2.5 bg-zinc-900 rounded-2xl border border-zinc-800">
                                    <Activity className="w-6 h-6 text-zinc-800" />
                                </div>
                                <Skeleton className="h-8 w-64 bg-zinc-800/50 rounded-lg" />
                            </div>
                            <Skeleton className="h-3 w-80 bg-zinc-800/30" />
                        </div>
                        <Skeleton className="h-10 w-48 rounded-xl bg-zinc-900 border border-zinc-800" />
                    </div>
                </CardHeader>

                <CardContent className="p-8 md:p-12 space-y-12">
                    {/* Basic Info Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="h-2 w-20 bg-zinc-800/50" />
                                <Skeleton className="h-16 w-full rounded-2xl bg-zinc-900/30 border border-zinc-800" />
                            </div>
                        ))}
                    </div>

                    {/* Measurement Section */}
                    <div className="p-8 rounded-[2.5rem] bg-zinc-900/10 border border-zinc-800 relative">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-48 bg-zinc-800/50" />
                                <Skeleton className="h-2 w-64 bg-zinc-800/30" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="space-y-3">
                                        <Skeleton className="h-2 w-24 bg-zinc-800/50" />
                                        <Skeleton className="h-16 w-full rounded-2xl bg-zinc-950 border border-zinc-800" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {/* Radio & Select Section */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <Skeleton className="h-2 w-32 bg-zinc-800/50" />
                                <div className="flex gap-4">
                                    <Skeleton className="h-16 flex-1 rounded-2xl bg-zinc-900/30 border border-zinc-800" />
                                    <Skeleton className="h-16 flex-1 rounded-2xl bg-zinc-900/30 border border-zinc-800" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Skeleton className="h-2 w-40 bg-zinc-800/50" />
                                <Skeleton className="h-16 w-full rounded-2xl bg-zinc-900/30 border border-zinc-800" />
                            </div>
                        </div>

                        {/* Result & Button Section */}
                        <div className="flex flex-col justify-end gap-8">
                            <Card className="p-8 rounded-[2.5rem] bg-zinc-900/30 border border-zinc-800 space-y-4 text-center">
                                <Skeleton className="h-2 w-32 mx-auto bg-zinc-800/30" />
                                <Skeleton className="h-16 w-48 mx-auto bg-zinc-800/50 rounded-xl" />
                            </Card>
                            <Skeleton className="h-16 sm:h-20 w-full rounded-3xl bg-zinc-800/50" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
