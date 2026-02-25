
import { Skeleton } from "@/components/ui/skeleton"
import { Users } from 'lucide-react'

export default function StudentFeedLoading() {
    return (
        <div className="space-y-12 pb-20 animate-pulse">
            {/* Header matches StudentFeedPage header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-900 rounded-xl">
                            <Users className="w-5 h-5 text-zinc-800" />
                        </div>
                        <Skeleton className="h-10 w-64 rounded-xl bg-zinc-800/50" />
                    </div>
                    <Skeleton className="h-4 w-64 bg-zinc-800/50" />
                </div>
            </header>

            {/* Feed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                        key={i}
                        className="relative rounded-3xl overflow-hidden border border-zinc-900 bg-zinc-950 aspect-[3/4]"
                    >
                        {/* Image Placeholder */}
                        <div className="absolute inset-0 bg-zinc-900/50" />

                        {/* Top Glass Badge Placeholder */}
                        <div className="absolute top-4 left-4">
                            <div className="bg-zinc-900/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                                <Skeleton className="h-2 w-16 bg-zinc-800/50" />
                            </div>
                        </div>

                        {/* Floating Info Card Placeholder */}
                        <div className="absolute inset-x-4 bottom-4 p-4 rounded-2xl bg-zinc-900/80 backdrop-blur-xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-12 h-12 rounded-full bg-zinc-800/50" />
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-24 bg-zinc-800/50" />
                                    <Skeleton className="h-2 w-32 bg-zinc-800/30" />
                                </div>
                            </div>
                            <Skeleton className="w-10 h-10 rounded-xl bg-zinc-800/50" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
