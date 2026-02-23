'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { DialogTitle } from '@/components/ui/dialog'

type PhotoType = 'front_url' | 'back_url' | 'side_right_url' | 'side_left_url'

interface PublicStudentGalleryProps {
    photos: any[]
}

export function PublicStudentGallery({ photos }: PublicStudentGalleryProps) {
    const [activeFilter, setActiveFilter] = useState<PhotoType | 'all'>('all')
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)

    const filters: { label: string, value: PhotoType | 'all' }[] = [
        { label: 'Todas', value: 'all' },
        { label: 'Frente', value: 'front_url' },
        { label: 'Costas', value: 'back_url' },
        { label: 'Lado D', value: 'side_right_url' },
        { label: 'Lado E', value: 'side_left_url' },
    ]

    // Normalize photos into a single list of items with their type
    const allItems: { url: string, type: PhotoType, date: string }[] = []
    photos.forEach(p => {
        if (p.front_url) allItems.push({ url: p.front_url, type: 'front_url', date: p.created_at })
        if (p.back_url) allItems.push({ url: p.back_url, type: 'back_url', date: p.created_at })
        if (p.side_right_url) allItems.push({ url: p.side_right_url, type: 'side_right_url', date: p.created_at })
        if (p.side_left_url) allItems.push({ url: p.side_left_url, type: 'side_left_url', date: p.created_at })
    })

    const filteredItems = activeFilter === 'all'
        ? allItems
        : allItems.filter(item => item.type === activeFilter)

    return (
        <div className="space-y-6">
            {/* Horizontal Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {filters.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => setActiveFilter(f.value)}
                        className={`
                            px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                            ${activeFilter === f.value
                                ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20'
                                : 'bg-zinc-900 text-zinc-500 hover:text-white border border-white/5'}
                        `}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-3 gap-2 md:gap-4">
                {filteredItems.map((item, i) => (
                    <div
                        key={`${item.url}-${i}`}
                        onClick={() => setSelectedPhotoIndex(i)}
                        className="group aspect-[3/4] relative rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 transition-all hover:scale-[0.98] cursor-zoom-in"
                    >
                        <Image
                            src={item.url}
                            alt="Progresso"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[7px] font-black uppercase tracking-tight text-white/70">
                            {new Date(item.date).toLocaleDateString()}
                        </div>
                    </div>
                ))}

                {filteredItems.length === 0 && (
                    <div className="col-span-3 py-20 flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-zinc-800 text-zinc-600 space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Nenhuma foto encontrada</span>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <Dialog open={selectedPhotoIndex !== null} onOpenChange={(open) => !open && setSelectedPhotoIndex(null)}>
                <DialogContent className="max-w-[95vw] w-full max-h-[95vh] p-0 border-none bg-black/90 backdrop-blur-xl flex items-center justify-center">
                    <VisuallyHidden>
                        <DialogTitle>Visualização de Foto</DialogTitle>
                    </VisuallyHidden>

                    {selectedPhotoIndex !== null && (
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <div className="relative aspect-[3/4] w-full max-h-[85vh]">
                                <Image
                                    src={filteredItems[selectedPhotoIndex].url}
                                    alt="Foto em destaque"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* Info Overlay */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">Tipo</p>
                                    <p className="text-xs font-black uppercase italic text-white leading-none">
                                        {filteredItems[selectedPhotoIndex].type.split('_')[0].replace('side', 'Lado')}
                                    </p>
                                </div>
                                <div className="w-px h-6 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">Data</p>
                                    <p className="text-xs font-black uppercase italic text-white leading-none">
                                        {new Date(filteredItems[selectedPhotoIndex].date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Controls */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(null); }}
                                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors z-50 text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {selectedPhotoIndex > 0 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(selectedPhotoIndex - 1); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full transition-colors z-50 text-white"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            )}

                            {selectedPhotoIndex < filteredItems.length - 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(selectedPhotoIndex + 1); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded-full transition-colors z-50 text-white"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
