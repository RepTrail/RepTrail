'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Calendar, Maximize2, X } from 'lucide-react'

interface PhotoSet {
    id: string
    front_url?: string
    back_url?: string
    side_right_url?: string
    side_left_url?: string
    created_at: string
}

interface StudentGalleryDialogProps {
    photos: PhotoSet[]
    studentName: string
    children?: React.ReactNode
}

export function StudentGalleryDialog({ photos, studentName, children }: StudentGalleryDialogProps) {
    const [open, setOpen] = useState(false)
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)

    // Sort photos by date (newest first)
    const sortedPhotos = [...photos].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    const poses = [
        { label: 'Todas', value: 'all' },
        { label: 'Frente', value: 'front' },
        { label: 'Costas', value: 'back' },
        { label: 'Lado Direto', value: 'side_right' },
        { label: 'Lado Esquerdo', value: 'side_left' },
    ]

    const renderPhotoGrid = (poseType: string) => {
        const filteredPhotos = sortedPhotos.flatMap(set => {
            if (poseType === 'all') {
                return [
                    { url: set.front_url, date: set.created_at, label: 'Frente' },
                    { url: set.back_url, date: set.created_at, label: 'Costas' },
                    { url: set.side_right_url, date: set.created_at, label: 'Lado Dir.' },
                    { url: set.side_left_url, date: set.created_at, label: 'Lado Esq.' },
                ].filter(p => p.url)
            }

            const url = (set as any)[`${poseType}_url`]
            return url ? [{ url, date: set.created_at, label: poses.find(p => p.value === poseType)?.label }] : []
        })

        if (filteredPhotos.length === 0) {
            return (
                <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-3 border-2 border-dashed border-zinc-900 rounded-2xl">
                    <Camera className="w-10 h-10 opacity-20" />
                    <p className="text-xs font-bold uppercase tracking-widest">Nenhuma foto encontrada</p>
                </div>
            )
        }

        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredPhotos.map((photo, i) => (
                    <div
                        key={`${photo.date}-${i}`}
                        className="group relative aspect-[3/4] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-all cursor-pointer"
                        onClick={() => setSelectedPhoto(photo.url)}
                    >
                        <img
                            src={photo.url}
                            alt={`Evolução ${photo.label}`}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
                            <p className="text-[10px] font-bold text-white uppercase tracking-tighter flex items-center gap-1.5 line-clamp-1">
                                <Calendar className="w-3 h-3 text-purple-400" />
                                {new Date(photo.date).toLocaleDateString('pt-BR')}
                            </p>
                            <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">{photo.label}</p>
                        </div>
                        <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children || (
                        <Button variant="outline" size="sm" className="h-8 border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg text-[10px] uppercase font-bold tracking-widest gap-2">
                            Ver Galeria
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-5xl max-w-[95vw] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-3xl">
                    <DialogHeader className="p-6 border-b border-zinc-900 bg-zinc-900/20">
                        <div className="flex items-center justify-between mt-2">
                            <div>
                                <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
                                    Galeria de <span className="text-purple-500">{studentName}</span>
                                </DialogTitle>
                                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                                    Acompanhe a evolução física visual através do tempo
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    <Tabs defaultValue="all" className="flex-1 flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-zinc-900 overflow-x-auto scrollbar-hide">
                            <TabsList className="bg-zinc-900 h-11 p-1 gap-1 w-full sm:w-auto justify-start border border-zinc-800/50 rounded-xl">
                                {poses.map(pose => (
                                    <TabsTrigger
                                        key={pose.value}
                                        value={pose.value}
                                        className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-200 data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg px-6 h-full transition-all"
                                    >
                                        {pose.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            {poses.map(pose => (
                                <TabsContent key={pose.value} value={pose.value} className="mt-0 outline-none">
                                    {renderPhotoGrid(pose.value)}
                                </TabsContent>
                            ))}
                        </div>
                    </Tabs>
                </DialogContent>
            </Dialog>

            {/* Lightbox */}
            {selectedPhoto && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
                    onClick={() => setSelectedPhoto(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-6 right-6 text-white hover:bg-white/10 rounded-full"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <X className="w-8 h-8" />
                    </Button>
                    <img
                        src={selectedPhoto}
                        alt="Zoom"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    )
}
