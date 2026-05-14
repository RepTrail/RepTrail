'use client'

import { useState, useTransition } from 'react'
import { Camera, Calendar, X, Maximize2, Pencil, Check, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteProgressPhoto, updateProgressPhotoDate } from '@/actions/student-actions'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { ENTITIES } from '@/lib/outbox-db'

interface PhotoSet {
    id: string
    front_url?: string
    back_url?: string
    side_right_url?: string
    side_left_url?: string
    created_at: string
}

interface StudentProgressGalleryProps {
    photos: PhotoSet[]
}

export function StudentProgressGallery({ photos }: StudentProgressGalleryProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editDate, setEditDate] = useState('')
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const sortedPhotos = [...photos].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // Flat list of all photos for navigation
    const allPhotos = sortedPhotos.flatMap(set => ([
        { url: set.front_url, label: 'Frente', type: 'front_url', date: set.created_at, id: set.id },
        { url: set.back_url, label: 'Costas', type: 'back_url', date: set.created_at, id: set.id },
        { url: set.side_right_url, label: 'Lado D', type: 'side_right_url', date: set.created_at, id: set.id },
        { url: set.side_left_url, label: 'Lado E', type: 'side_left_url', date: set.created_at, id: set.id },
    ].filter(p => !!p.url))) as any[]

    const { mutate: deleteMutate } = useOptimisticMutation({
        actionName: 'delete-progress-photo',
        entity: ENTITIES.PROGRESS_PHOTO,
        entityId: 'delete',
        queryKey: ['student'],
        mutationFn: async () => {}, // Single-writer: no-op
        onMutate: () => {
            const previous = queryClient.getQueryData(['student'])
            // Ideally we'd remove the item from cache here for 0ms visual deletion
            return { previous }
        },
        onSuccess: () => {
            toast({ title: "Removido!", description: "O registro de fotos está sendo removido." })
        },
        onError: (err, variables, ctx) => {
            queryClient.setQueryData(['student'], ctx?.previous)
            toast({ variant: "destructive", title: "Erro", description: "Ocorreu um erro." })
        }
    })

    const { mutate: updateDateMutate } = useOptimisticMutation({
        actionName: 'update-progress-photo-date',
        entity: ENTITIES.PROGRESS_PHOTO,
        entityId: 'update',
        queryKey: ['student'],
        mutationFn: async () => {}, // Single-writer: no-op
        onMutate: () => {
            setEditingId(null)
            return {}
        },
        onSuccess: () => {
            toast({ title: "Data atualizada!", description: "A data será refletida em todo o sistema em instantes." })
        },
        onError: (err, variables, ctx) => {
            queryClient.setQueryData(['student'], ctx?.previous)
            toast({ variant: "destructive", title: "Erro", description: "Ocorreu um erro." })
        }
    })

    function handleDelete(photoId: string) {
        if (!confirm('Tem certeza que deseja remover este registro de fotos?')) return
        deleteMutate({ photoId })
    }

    function handleDateSave(photoId: string) {
        if (!editDate) return
        updateDateMutate({ photoId, newDate: new Date(editDate).toISOString() })
    }

    function startEditing(id: string, currentDate: string) {
        setEditingId(id)
        // Format to YYYY-MM-DD for input date
        setEditDate(new Date(currentDate).toISOString().split('T')[0])
    }


    if (sortedPhotos.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-3 border-2 border-dashed border-zinc-800 rounded-2xl">
                <Camera className="w-10 h-10 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">Nenhuma foto encontrada</p>
            </div>
        )
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedPhotos.map((set) => {
                    const photosInSet = [
                        { url: set.front_url, label: 'Frente', key: 'front' },
                        { url: set.back_url, label: 'Costas', key: 'back' },
                        { url: set.side_right_url, label: 'Lado Dir.', key: 'side_right' },
                        { url: set.side_left_url, label: 'Lado Esq.', key: 'side_left' },
                    ].filter((p): p is { url: string; label: string; key: string } => !!p.url)

                    if (photosInSet.length === 0) return null

                    return (
                        <div
                            key={set.id}
                            className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-purple-500/50 transition-all"
                            onMouseEnter={() => setHoveredId(set.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 group/date">
                                        <Calendar className="w-4 h-4 text-purple-500" />

                                        {editingId === set.id ? (
                                            <div className="flex items-center gap-1 animate-in fade-in zoom-in duration-300">
                                                <Input
                                                    type="date"
                                                    value={editDate}
                                                    onChange={(e) => setEditDate(e.target.value)}
                                                    className="h-6 w-32 px-2 text-[10px] bg-zinc-950 border-zinc-700 focus:ring-purple-500/50 text-white [color-scheme:dark]"
                                                />
                                                <Button size="sm" variant="ghost" onClick={() => handleDateSave(set.id)} className="h-6 w-6 p-0 hover:bg-emerald-500/20 text-emerald-500">
                                                    <Check className="w-3 h-3" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-500">
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-white uppercase tracking-tight">
                                                    {new Date(set.created_at).toLocaleDateString('pt-BR')}
                                                </span>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => startEditing(set.id, set.created_at)}
                                                    className="h-6 w-6 p-0 opacity-0 group-hover/date:opacity-100 transition-opacity hover:bg-white/10 text-zinc-500 hover:text-white rounded-full"
                                                >
                                                    <Pencil className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    {hoveredId === set.id && !editingId && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(set.id)}
                                            className="h-7 w-7 p-0 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 p-4">
                                {photosInSet.map((photo, idx) => {
                                    const globalIndex = allPhotos.findIndex(p => p.url === photo.url)
                                    return (
                                        <div
                                            key={`${set.id}-${photo.key}`}
                                            className="relative aspect-[3/4] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer group/item"
                                            onClick={() => setSelectedPhotoIndex(globalIndex)}
                                        >
                                            <img
                                                src={photo.url}
                                                alt={photo.label}
                                                className="w-full h-full object-cover grayscale group-hover/item:grayscale-0 transition-all duration-500"
                                            />
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 translate-y-2 group-hover/item:translate-y-0 transition-transform">
                                                <p className="text-[9px] font-bold text-white uppercase tracking-tighter">
                                                    {photo.label}
                                                </p>
                                            </div>
                                            <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                                                <Maximize2 className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Premium Lightbox Modal */}
            <Dialog open={selectedPhotoIndex !== null} onOpenChange={(open) => !open && setSelectedPhotoIndex(null)}>
                <DialogContent className="max-w-[95vw] w-full max-h-[95vh] p-0 border-none bg-black/90 backdrop-blur-xl flex items-center justify-center" showCloseButton={false}>
                    <VisuallyHidden>
                        <DialogTitle>Visualização de Foto</DialogTitle>
                    </VisuallyHidden>

                    {selectedPhotoIndex !== null && (
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <div className="relative aspect-[3/4] w-full max-h-[85vh]">
                                <img
                                    src={allPhotos[selectedPhotoIndex].url}
                                    alt="Foto em destaque"
                                    className="w-full h-full object-contain rounded-lg"
                                />
                            </div>

                            {/* Info Overlay */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 flex items-center gap-6">
                                <div className="text-center">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">Tipo</p>
                                    <p className="text-xs font-black uppercase italic text-white leading-none">
                                        {allPhotos[selectedPhotoIndex].label}
                                    </p>
                                </div>
                                <div className="w-px h-6 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-1">Data</p>
                                    <p className="text-xs font-black uppercase italic text-white leading-none">
                                        {new Date(allPhotos[selectedPhotoIndex].date).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                            </div>

                            {/* Controls */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(null); }}
                                className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 border border-white/10 rounded-full transition-all z-50 text-white shadow-xl backdrop-blur-sm"
                            >
                                <X className="w-6 h-6 drop-shadow-md" />
                            </button>

                            {selectedPhotoIndex > 0 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(selectedPhotoIndex - 1); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 border border-white/10 rounded-full transition-all z-50 text-white shadow-xl backdrop-blur-sm"
                                >
                                    <ChevronLeft className="w-6 h-6 drop-shadow-md" />
                                </button>
                            )}

                            {selectedPhotoIndex < allPhotos.length - 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(selectedPhotoIndex + 1); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 border border-white/10 rounded-full transition-all z-50 text-white shadow-xl backdrop-blur-sm"
                                >
                                    <ChevronRight className="w-6 h-6 drop-shadow-md" />
                                </button>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
