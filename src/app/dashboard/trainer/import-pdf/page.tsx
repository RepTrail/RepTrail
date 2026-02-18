import { PdfUploader } from '@/components/feature/pdf/pdf-uploader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUp, Sparkles, Dumbbell, Utensils, Activity } from "lucide-react"
import { LockedFeature } from '@/components/ui/locked-feature'
import { getTrainerTier } from '@/actions/trainer-actions'

export default async function ImportPdfPage() {
    const currentTier = await getTrainerTier()

    return (
        <div className="space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2 pb-2 border-b border-zinc-800/50">
                <h1 className="text-4xl font-black tracking-tight text-white font-sans italic uppercase">
                    Importação Inteligente
                </h1>
                <p className="text-zinc-500 text-sm font-medium">
                    Transforme seus arquivos PDF em treinos e dietas interativos usando nossa tecnologia de IA.
                </p>
            </div>

            <LockedFeature isLocked={currentTier === 'start'} requiredTier="pro" message="Importação de PDF disponível nos planos PRO e ELITE">
                <Tabs defaultValue="workout" className="w-full">
                    <TabsList className="bg-zinc-950 border border-zinc-800 p-1 h-14 rounded-2xl w-full max-w-md shadow-2xl">
                        <TabsTrigger
                            value="workout"
                            className="rounded-xl group data-[state=active]:bg-zinc-900 data-[state=active]:border-zinc-700 border border-transparent transition-all h-full"
                        >
                            <div className="flex items-center gap-2 h-full px-4 font-bold uppercase tracking-widest text-[10px] text-zinc-500 group-hover:text-zinc-200 group-data-[state=active]:text-white">
                                <Activity className="w-3 h-3 text-zinc-500 group-hover:text-zinc-400 group-data-[state=active]:text-white" />
                                Treino
                            </div>
                        </TabsTrigger>
                        <TabsTrigger
                            value="diet"
                            className="rounded-xl group data-[state=active]:bg-zinc-900 data-[state=active]:border-zinc-700 border border-transparent transition-all h-full"
                        >
                            <div className="flex items-center gap-2 h-full px-4 font-bold uppercase tracking-widest text-[10px] text-zinc-500 group-hover:text-zinc-200 group-data-[state=active]:text-white">
                                <Utensils className="w-3 h-3 text-zinc-500 group-hover:text-zinc-400 group-data-[state=active]:text-white" />
                                Dieta
                            </div>
                        </TabsTrigger>
                    </TabsList>

                    <div className="mt-8">
                        <TabsContent value="workout" className="m-0 focus-visible:outline-none">
                            <PdfUploader type="workout" />
                        </TabsContent>
                        <TabsContent value="diet" className="m-0 focus-visible:outline-none">
                            <PdfUploader type="diet" />
                        </TabsContent>
                    </div>
                </Tabs>
            </LockedFeature>
        </div>
    )
}
