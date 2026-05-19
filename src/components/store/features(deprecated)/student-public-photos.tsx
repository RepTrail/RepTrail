import { createClient } from '@/lib/supabase/server'
import { Trophy, Activity } from 'lucide-react'
import Image from 'next/image'
import { ShareTransformation } from './student-share-transformation'
import { PublicStudentGallery } from './student-public-gallery'

import { UnifiedProgressGallery } from '@/components/store/advanced/unified-progress-gallery'

interface Props {
    studentId: string
    isOwner: boolean
    studentName: string
    photos: any[]
}

export async function PhotosAndTransformation({ studentId, isOwner, studentName, photos }: Props) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    const oldestPhoto = photos && photos.length > 0 ? photos[photos.length - 1] : null;
    const newestPhoto = photos && photos.length > 0 ? photos[0] : null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-3 pb-4">
                        <div className="p-2 bg-amber-500/10 rounded-system border border-amber-500/20">
                            <Trophy className="w-6 h-6 text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Antes vs Depois</h2>
                    </div>
                    {isOwner && (
                        <div className="flex-shrink-0">
                            <ShareTransformation
                                studentName={studentName}
                                beforeUrl={oldestPhoto?.front_url}
                                afterUrl={newestPhoto?.front_url}
                                beforeDate={oldestPhoto?.created_at}
                                afterDate={newestPhoto?.created_at}
                            />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ponto de Partida</span>
                        <div className="aspect-[3/4] relative rounded-system overflow-hidden border border-white/5 bg-zinc-900 group">
                            {oldestPhoto ? (
                                <Image src={oldestPhoto.front_url} alt="Antes" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-800 uppercase font-black italic text-xs">Sem foto</div>
                            )}
                            <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] font-black uppercase italic">
                                Início
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Status Atual</span>
                        <div className="aspect-[3/4] relative rounded-system overflow-hidden border border-emerald-500/30 bg-zinc-900 group">
                            {newestPhoto ? (
                                <Image src={newestPhoto.front_url} alt="Depois" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-zinc-800 uppercase font-black italic text-xs">Sem foto</div>
                            )}
                            <div className="absolute top-4 left-4 bg-emerald-500 px-3 py-1 rounded-full text-zinc-950 text-[8px] font-black uppercase italic">
                                Atual
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-3 pb-4">
                    <Activity className="w-6 h-6 text-purple-500" />
                    <h2 className="text-2xl font-black italic uppercase tracking-tight">Galeria de Progresso</h2>
                </div>
                <UnifiedProgressGallery photos={photos || []} mode="public" studentName={studentName} />
            </div>
        </div>
    )
}



