
import { Skeleton } from "@/components/ui/skeleton"

export default function StudentsLoading() {
    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-zinc-800/50">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex items-center gap-3 pb-4">
                    <Skeleton className="h-10 w-32 rounded-xl" />
                    <Skeleton className="h-10 w-32 rounded-xl" />
                </div>
            </div>

            {/* Metrics Mini-Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 shadow-xl flex items-center justify-between border-t-zinc-700/10">
                        <div className="space-y-2 w-full">
                            <Skeleton className="h-3 w-24" />
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-7 w-16" />
                                <Skeleton className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Students Table Skeleton */}
            <div className="bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden border-t-zinc-700/50">
                <div className="bg-zinc-900/10 border-b border-zinc-900/50 px-6 py-4 flex flex-row items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-9 w-48 rounded-xl" />
                </div>
                <div className="p-0">
                    <div className="space-y-1">
                        {/* Table Header like skeleton */}
                        <div className="hidden md:flex bg-zinc-900/30  py-3 border-b border-zinc-900 gap-4">
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 flex-1" />
                            <Skeleton className="h-4 w-20" />
                        </div>

                        {/* Rows */}
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className=" py-4 border-b border-zinc-900/50 flex flex-col md:flex-row md:items-center gap-4">
                                {/* Mobile view mimics */}
                                <div className="flex items-center gap-3 pb-4 flex-1">
                                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                                    <div className="space-y-2 w-full">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                </div>
                                <div className="hidden md:block flex-1">
                                    <div className="space-y-1">
                                        <Skeleton className="h-3 w-32" />
                                        <Skeleton className="h-2 w-20" />
                                    </div>
                                </div>
                                <div className="hidden md:block flex-1">
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <div className="hidden md:flex gap-2 w-24 justify-end">
                                    <Skeleton className="h-6 w-16 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
