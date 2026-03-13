'use client'

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function AuthFormSkeleton() {
    return (
        <div className="w-full max-w-[440px] space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
                {/* Logo Skeleton */}
                <div className="flex items-center gap-3 pb-4 mb-4">
                    <Skeleton className="w-12 h-12 rounded-2xl rotate-3" />
                    <Skeleton className="w-32 h-10 rounded-xl" />
                </div>
                {/* Title and Badge Skeletons */}
                <Skeleton className="h-8 w-64 rounded-xl" />
                <Skeleton className="h-4 w-48 rounded-lg" />
            </div>

            <Card className="bg-zinc-900 border-zinc-800 shadow-2xl rounded-3xl overflow-hidden border-t-zinc-700/50">
                <CardContent className="p-8 space-y-6">
                    {/* Input Fields */}
                    <div className="space-y-2">
                        <Skeleton className="h-3 w-24 ml-1" />
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Skeleton className="h-3 w-24 ml-1" />
                            <Skeleton className="h-3 w-20" />
                        </div>
                        <Skeleton className="h-12 w-full rounded-xl" />
                    </div>
                    {/* Button */}
                    <Skeleton className="h-12 w-full rounded-xl mt-4" />
                </CardContent>
                <CardFooter className="bg-zinc-950/50 border-t border-zinc-800 p-6 flex justify-center">
                    <Skeleton className="h-4 w-48 rounded-lg" />
                </CardFooter>
            </Card>

            <div className="flex items-center justify-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-3 w-40 rounded-lg" />
            </div>
        </div>
    )
}
