'use client'

import { PdfUploader } from '@/components/feature/pdf/pdf-uploader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Utensils } from "lucide-react"
import { useEffect, useState } from 'react'

export function ImportPdfClient({ students, role = 'trainer', userId }: { students?: any[], role?: 'trainer' | 'student', userId: string }) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return <div className="animate-pulse bg-zinc-900 h-96 rounded-2xl" />
    }

    return (
        <div className="space-y-10 pb-10" suppressHydrationWarning>
            <Tabs defaultValue="workout" className="w-full">
                <TabsList 
                    id="tour-import-type"
                    className="bg-zinc-950 border border-zinc-800 p-1 h-14 rounded-2xl w-full max-w-md shadow-2xl"
                >
                    <TabsTrigger
                        value="workout"
                        className="rounded-xl group data-[state=active]:bg-zinc-900 data-[state=active]:border-zinc-700 border border-transparent transition-all h-full"
                    >
                        <div className="flex items-center gap-2 h-full  font-bold uppercase tracking-widest text-[10px] text-zinc-500 group-hover:text-zinc-200 group-data-[state=active]:text-white">
                            <Activity className="w-3 h-3 text-zinc-500 group-hover:text-zinc-400 group-data-[state=active]:text-white" />
                            Treino
                        </div>
                    </TabsTrigger>
                    <TabsTrigger
                        value="diet"
                        className="rounded-xl group data-[state=active]:bg-zinc-900 data-[state=active]:border-zinc-700 border border-transparent transition-all h-full"
                    >
                        <div className="flex items-center gap-2 h-full  font-bold uppercase tracking-widest text-[10px] text-zinc-500 group-hover:text-zinc-200 group-data-[state=active]:text-white">
                            <Utensils className="w-3 h-3 text-zinc-500 group-hover:text-zinc-400 group-data-[state=active]:text-white" />
                            Dieta
                        </div>
                    </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                    <TabsContent value="workout" className="m-0 focus-visible:outline-none">
                        <PdfUploader type="workout" students={students} role={role} userId={userId} />
                    </TabsContent>
                    <TabsContent value="diet" className="m-0 focus-visible:outline-none">
                        <PdfUploader type="diet" students={students} role={role} userId={userId} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    )
}
