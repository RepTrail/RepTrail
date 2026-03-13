
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
    GripVertical,
    Trash2,
    Plus,
    Search,
    ArrowLeft,
    Pencil
} from "lucide-react"

export default function WorkoutBuilderLoading() {
    return (
        <div className="max-w-5xl mx-auto  sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
            {/* Header / Meta */}
            <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0 space-y-3">
                        <Skeleton className="h-10 w-64 bg-zinc-800/50 rounded-xl" />
                        <Skeleton className="h-4 w-40 bg-zinc-800/30 rounded-md" />
                    </div>
                    <div className="mt-1 p-2 rounded-xl border border-zinc-800/50">
                        <Pencil className="w-4 h-4 text-zinc-800" />
                    </div>
                </div>
            </div>

            {/* Exercise List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-7 w-48 bg-zinc-800/50 rounded-lg" />
                        <Skeleton className="h-5 w-8 bg-zinc-800/30 rounded-full" />
                    </div>
                </div>

                {[1, 2].map((i) => (
                    <Card key={i} className="bg-zinc-950 border-zinc-800 overflow-hidden">
                        <CardHeader className="p-0">
                            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                                <div className="flex items-center gap-3 pb-4">
                                    <GripVertical className="text-zinc-800" />
                                    <Skeleton className="h-5 w-48 bg-zinc-800/50 rounded-md" />
                                </div>
                                <Trash2 className="w-4 h-4 text-zinc-800" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col gap-6">
                            {/* SET GROUPS */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* WARMUP, FEEDER, WORKING (Skeleton pattern) */}
                                {[1, 2, 3].map((group) => (
                                    <div key={group} className={`space-y-4 p-4 rounded-xl border ${group === 3 ? 'bg-blue-500/5 border-blue-500/20' : 'bg-zinc-900/40 border-zinc-800/80'}`}>
                                        <div className="border-b border-zinc-800/50 pb-2">
                                            <Skeleton className={`h-3 w-24 rounded ${group === 3 ? 'bg-blue-500/20' : 'bg-zinc-800/50'}`} />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[1, 2, 3].map((input) => (
                                                <div key={input} className="space-y-1.5 text-center">
                                                    <Skeleton className="h-2 w-10 bg-zinc-800/30 mx-auto rounded" />
                                                    <Skeleton className="h-9 w-full bg-zinc-950 border border-zinc-800 rounded-md" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* NOTES SECTION */}
                            <div className="flex flex-col gap-0">
                                <div className="bg-zinc-900/50 px-3 py-2 rounded-t-lg border-x border-t border-zinc-800">
                                    <Skeleton className="h-3 w-48 bg-zinc-800/50 rounded" />
                                </div>
                                <div className="bg-zinc-950 border border-zinc-800 h-24 rounded-b-lg p-3">
                                    <Skeleton className="h-3 w-full bg-zinc-800/20 rounded" />
                                    <Skeleton className="h-3 w-2/3 bg-zinc-800/20 rounded mt-2" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Adicionar Exercício */}
            <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 space-y-4">
                <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-zinc-800" />
                    <Skeleton className="h-6 w-40 bg-zinc-800/50 rounded-lg" />
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-800" />
                    <Skeleton className="h-12 w-full bg-zinc-950 border border-zinc-800 rounded-xl" />
                </div>
            </div>

            {/* Footer */}
            <div className="pt-12 flex justify-center border-t border-zinc-800/30">
                <div className="flex items-center gap-2 text-zinc-800">
                    <ArrowLeft className="w-4 h-4" />
                    <Skeleton className="h-4 w-48 bg-zinc-800/30 rounded-md" />
                </div>
            </div>
        </div>
    )
}
