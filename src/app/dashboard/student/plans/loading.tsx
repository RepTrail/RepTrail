
import { Skeleton } from "@/components/ui/skeleton"
import { Dumbbell, Search, Check, ShieldCheck, CreditCard } from 'lucide-react'

export default function StudentPlansLoading() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-pulse">
            <div className="text-center space-y-4">
                <Skeleton className="h-12 w-80 mx-auto bg-zinc-800/50 rounded-2xl" />
                <Skeleton className="h-4 w-96 mx-auto bg-zinc-800/30" />
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-10">
                {/* Auto Treino Plan Skeleton */}
                <div className="relative p-8 rounded-3xl border border-zinc-800 bg-zinc-900/40 space-y-8">
                    <div className="flex items-center gap-3 pb-4">
                        <Dumbbell className="text-zinc-800" />
                        <Skeleton className="h-8 w-32 bg-zinc-800/50 rounded-lg" />
                    </div>

                    <div className="flex items-end gap-1">
                        <Skeleton className="h-12 w-32 bg-zinc-800/50 rounded-xl" />
                        <Skeleton className="h-4 w-12 bg-zinc-800/20 mb-1" />
                    </div>

                    <ul className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <li key={i} className="flex items-center gap-3 pb-4">
                                <Check className="w-5 h-5 text-zinc-800" />
                                <Skeleton className="h-3 w-48 bg-zinc-800/20" />
                            </li>
                        ))}
                    </ul>

                    <Skeleton className="h-14 w-full rounded-2xl bg-zinc-800/30 border border-zinc-800/50" />
                </div>

                {/* Com Personal Plan Skeleton */}
                <div className="p-8 rounded-3xl bg-zinc-900/40 border border-zinc-800 space-y-8">
                    <div className="flex items-center gap-3 pb-4">
                        <Search className="text-zinc-800" />
                        <Skeleton className="h-8 w-32 bg-zinc-800/50 rounded-lg" />
                    </div>

                    <div className="flex items-end gap-1">
                        <Skeleton className="h-12 w-28 bg-zinc-800/50 rounded-xl" />
                        <Skeleton className="h-4 w-12 bg-zinc-800/20 mb-1" />
                    </div>

                    <ul className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <li key={i} className="flex items-center gap-3 pb-4">
                                <Check className="w-5 h-5 text-zinc-800" />
                                <Skeleton className="h-3 w-48 bg-zinc-800/20" />
                            </li>
                        ))}
                    </ul>

                    <Skeleton className="h-14 w-full rounded-2xl bg-zinc-800/30 border border-zinc-800/50" />
                </div>
            </div>

            <div className="flex items-center justify-center gap-8 text-center opacity-20 pb-8">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <Skeleton className="h-2 w-24 bg-zinc-800" />
                </div>
                <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    <Skeleton className="h-2 w-24 bg-zinc-800" />
                </div>
            </div>
        </div>
    )
}
