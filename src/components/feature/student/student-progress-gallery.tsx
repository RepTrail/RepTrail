'use client'

import { useState, useTransition } from 'react'
import { Camera, Calendar, X, Maximize2, Pencil, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteProgressPhoto, updateProgressPhotoDate } from '@/actions/student-actions'
import { useToast } from '@/hooks/use-toast'

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
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
    const [hoveredId, setHoveredId] = useState<string | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editDate, setEditDate] = useState('')
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const sortedPhotos = [...photos].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    async function handleDelete(photoId: string) {
        if (!confirm('Tem certeza que deseja remover este registro de fotos?')) return

        const res = await deleteProgressPhoto(photoId)
        if (res.success) {
            toast({ title: "Removido!", description: "O registro de fotos foi removido." })
            // The parent component should refetch the data
            window.location.reload()
        } else {
            toast({ variant: "destructive", title: "Erro", description: res.error })
        }
    }

    async function handleDateSave(photoId: string) {
        if (!editDate) return

        startTransition(async () => {
            const res = await updateProgressPhotoDate(photoId, new Date(editDate).toISOString())
            if (res.success) {
                toast({ title: "Data atualizada!" })
                setEditingId(null)
                // window.location.reload() // Next.js revalidatePath handle this? Usually yes if server component re-renders. But this is client component receiving props.
                // We might need to full reload or router.refresh() if revalidatePath doesn't work on client component props update instantly
                // Actually revalidatePath works on next fetch. But props are passed from server component.
                // So we need to refresh the router.
                window.location.reload()
            } else {
                toast({ variant: "destructive", title: "Erro", description: res.error })
            }
        })
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
                                                <Button size="sm" variant="ghost" onClick={() => handleDateSave(set.id)} disabled={isPending} className="h-6 w-6 p-0 hover:bg-emerald-500/20 text-emerald-500">
                                                    <Check className="w-3 h-3" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} disabled={isPending} className="h-6 w-6 p-0 hover:bg-red-500/20 text-red-500">
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
                                {photosInSet.map((photo, idx) => (
                                    <div
                                        key={`${set.id}-${photo.key}`}
                                        className="relative aspect-[3/4] bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 cursor-pointer group/item"
                                        onClick={() => setSelectedPhoto(photo.url ?? null)}
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
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

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
