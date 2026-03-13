'use client'

import { useState, useTransition } from 'react'
import { Camera, Calendar, X, Maximize2, Pencil, Check, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { deleteProgressPhoto, updateProgressPhotoDate } from '@/actions/student-actions'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type PhotoType = 'front_url' | 'back_url' | 'side_right_url' | 'side_left_url'

interface PhotoSet {
    id: string
    front_url?: string
    back_url?: string
    side_right_url?: string
    side_left_url?: string
    created_at: string
}

interface UnifiedProgressGalleryProps {
    photos: PhotoSet[]
    mode?: 'student' | 'trainer' | 'public'
    studentName?: string
}

export function UnifiedProgressGallery({ photos, mode = 'public', studentName }: UnifiedProgressGalleryProps) {
    const [activeFilter, setActiveFilter] = useState<PhotoType | 'all'>('all')
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
    const [hoveredSetId, setHoveredSetId] = useState<string | null>(null)
    const [editingSetId, setEditingSetId] = useState<string | null>(null)
    const [editDate, setEditDate] = useState('')
    const [isPending, startTransition] = useTransition()
    const { toast } = useToast()

    const filters: { label: string, value: PhotoType | 'all' }[] = [
        { label: 'Todas', value: 'all' },
        { label: 'Frente', value: 'front_url' },
        { label: 'Costas', value: 'back_url' },
        { label: 'Lado D', value: 'side_right_url' },
        { label: 'Lado E', value: 'side_left_url' },
    ]

    const typeLabels: Record<string, string> = {
        'front_url': 'Frente',
        'back_url': 'Costas',
        'side_right_url': 'Lado Dir.',
        'side_left_url': 'Lado Esq.'
    }

    // 1. Sort photo sets by date (newest first)
    const sortedSets = [...photos].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // 2. Flat list of all individual photos for the lightbox navigation
    const allItems: { url: string, type: PhotoType, date: string, setId: string }[] = []
    sortedSets.forEach(set => {
        if (set.front_url) allItems.push({ url: set.front_url, type: 'front_url', date: set.created_at, setId: set.id })
        if (set.back_url) allItems.push({ url: set.back_url, type: 'back_url', date: set.created_at, setId: set.id })
        if (set.side_right_url) allItems.push({ url: set.side_right_url, type: 'side_right_url', date: set.created_at, setId: set.id })
        if (set.side_left_url) allItems.push({ url: set.side_left_url, type: 'side_left_url', date: set.created_at, setId: set.id })
    })

    // 3. Filtered items for display
    const filteredItems = activeFilter === 'all'
        ? allItems
        : allItems.filter(item => item.type === activeFilter)

    async function handleDelete(setId: string) {
        if (!confirm('Tem certeza que deseja remover este registro de fotos?')) return

        const res = await deleteProgressPhoto(setId)
        if (res.success) {
            toast({ title: "Removido!", description: "O registro de fotos foi removido." })
            window.location.reload()
        } else {
            toast({ variant: "destructive", title: "Erro", description: res.error })
        }
    }

    async function handleDateSave(setId: string) {
        if (!editDate) return
        startTransition(async () => {
            const res = await updateProgressPhotoDate(setId, new Date(editDate).toISOString())
            if (res.success) {
                toast({ title: "Data atualizada!" })
                setEditingSetId(null)
                window.location.reload()
            } else {
                toast({ variant: "destructive", title: "Erro", description: res.error })
            }
        })
    }

    function startEditing(id: string, currentDate: string) {
        setEditingSetId(id)
        setEditDate(new Date(currentDate).toISOString().split('T')[0])
    }

    const canEdit = mode === 'student'

    if (photos.length === 0) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-zinc-500 gap-3 border-2 border-dashed border-zinc-900 rounded-[2.5rem] bg-zinc-900/20">
                <Camera className="w-10 h-10 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em]">Nenhuma foto encontrada</p>
            </div>
        )
    }

    const renderPhotoCard = (item: { url: string, type: PhotoType, date: string, setId: string }, index: number) => {
        const isHovered = hoveredSetId === item.setId

        return (
            <div
                key={`${item.url}-${index}`}
                className="group relative flex flex-col gap-2"
                onMouseEnter={() => setHoveredSetId(item.setId)}
                onMouseLeave={() => setHoveredSetId(null)}
            >
                {/* Photo Card */}
                <div
                    onClick={() => setSelectedPhotoIndex(index)}
                    className="aspect-[3/4] relative rounded-2xl overflow-hidden border border-white/5 bg-zinc-900 transition-all hover:scale-[0.98] cursor-zoom-in shadow-xl group-hover:border-emerald-500/30"
                >
                    <Image
                        src={item.url}
                        alt="Progresso"
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
                        <div className="flex items-center justify-between gap-1">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">
                                    {typeLabels[item.type]}
                                </span>
                                <span className="text-[9px] font-bold text-white uppercase tracking-tighter line-clamp-1">
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                            </div>
                            <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header / Filter Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b border-zinc-900">
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
                    <Filter className="w-3.5 h-3.5 text-zinc-600 mr-2 shrink-0" />
                    {filters.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setActiveFilter(f.value)}
                            className={cn(
                                "py-2 px-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                activeFilter === f.value
                                    ? 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-lg shadow-emerald-500/20'
                                    : 'bg-zinc-900/50 text-zinc-500 hover:text-white border-white/5 hover:border-white/10'
                            )}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                {canEdit && (
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest italic shrink-0">
                        Clique no lápis para ajustar a data
                    </p>
                )}
            </div>

            {/* Gallery Content */}
            {activeFilter === 'all' ? (
                <div className="space-y-12">
                    {sortedSets.map((set, setIdx) => {
                        const isEditing = editingSetId === set.id
                        const sessionPhotos = []
                        if (set.front_url) sessionPhotos.push({ url: set.front_url, type: 'front_url' as PhotoType, date: set.created_at, setId: set.id })
                        if (set.back_url) sessionPhotos.push({ url: set.back_url, type: 'back_url' as PhotoType, date: set.created_at, setId: set.id })
                        if (set.side_right_url) sessionPhotos.push({ url: set.side_right_url, type: 'side_right_url' as PhotoType, date: set.created_at, setId: set.id })
                        if (set.side_left_url) sessionPhotos.push({ url: set.side_left_url, type: 'side_left_url' as PhotoType, date: set.created_at, setId: set.id })

                        return (
                            <div key={set.id} className="space-y-6 pt-10 first:pt-0 border-t border-zinc-900 first:border-none">
                                {/* Session Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5">
                                            <Calendar className="w-5 h-5 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black uppercase italic tracking-tighter text-white">
                                                Atualização de {new Date(set.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                                            </h3>
                                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                {sessionPhotos.length} Fotos Registradas
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {canEdit && (
                                            <>
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                                                        <Input
                                                            type="date"
                                                            value={editDate}
                                                            onChange={(e) => setEditDate(e.target.value)}
                                                            className="h-8 w-36 px-3 text-[11px] bg-zinc-900 border-zinc-800 text-white rounded-xl focus:ring-emerald-500/20"
                                                        />
                                                        <div className="flex gap-1">
                                                            <Button size="sm" onClick={() => handleDateSave(set.id)} disabled={isPending} className="h-8 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase text-[10px] tracking-widest  rounded-xl">
                                                                Salvar
                                                            </Button>
                                                            <Button size="icon" variant="ghost" onClick={() => setEditingSetId(null)} disabled={isPending} className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-xl">
                                                                <X className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => startEditing(set.id, set.created_at)}
                                                            className="h-8 border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl text-[10px] font-black uppercase tracking-widest gap-2"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                            Editar Data
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(set.id)}
                                                            className="h-8 border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest group"
                                                        >
                                                            <X className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                                        </Button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Photos Grid for this session */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {sessionPhotos.map((photo, pIdx) => {
                                        // Find index in allItems for lightbox
                                        const globalIdx = allItems.findIndex(ai => ai.url === photo.url)
                                        return renderPhotoCard({ ...photo, date: set.created_at, setId: set.id }, globalIdx)
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredItems.map((item, i) => {
                        const isEditing = editingSetId === item.setId

                        return (
                            <div key={`${item.url}-${i}`} className="space-y-3">
                                {renderPhotoCard(item, i)}
                                {canEdit && (
                                    <div className="px-1 flex items-center justify-between">
                                        {isEditing ? (
                                            <div className="flex items-center gap-1 w-full animate-in fade-in zoom-in duration-300">
                                                <Input
                                                    type="date"
                                                    value={editDate}
                                                    onChange={(e) => setEditDate(e.target.value)}
                                                    className="h-7 px-2 text-[10px] bg-zinc-900 border-zinc-800 text-white rounded-lg"
                                                />
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" onClick={() => handleDateSave(item.setId)} disabled={isPending} className="h-7 w-7 p-0 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all">
                                                        <Check className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" onClick={() => setEditingSetId(null)} disabled={isPending} className="h-7 w-7 p-0 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                                                        <X className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between w-full group/date">
                                                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(item.date).toLocaleDateString()}
                                                </span>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => startEditing(item.setId, item.date)}
                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10 text-zinc-500 hover:text-white rounded-lg"
                                                >
                                                    <Pencil className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Lightbox Modal */}
            <Dialog open={selectedPhotoIndex !== null} onOpenChange={(open) => !open && setSelectedPhotoIndex(null)}>
                <DialogContent className="max-w-[95vw] w-full max-h-[95vh] p-0 border-none bg-black/95 backdrop-blur-2xl flex items-center justify-center transition-all duration-300" showCloseButton={false}>
                    <VisuallyHidden>
                        <DialogTitle>Visualização de Foto</DialogTitle>
                    </VisuallyHidden>

                    {selectedPhotoIndex !== null && (
                        <div className="relative w-full h-full flex items-center justify-center p-4">
                            <div className="relative aspect-[3/4] w-full max-h-[85vh] animate-in zoom-in-95 duration-300">
                                <Image
                                    src={filteredItems[selectedPhotoIndex].url}
                                    alt="Visualização"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>

                            {/* Info Overlay */}
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900/80 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-white/10 flex items-center gap-8 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-2">Pose</p>
                                    <p className="text-sm font-black uppercase italic text-white leading-none tracking-tight">
                                        {typeLabels[filteredItems[selectedPhotoIndex].type]}
                                    </p>
                                </div>
                                <div className="w-px h-8 bg-white/10" />
                                <div className="text-center">
                                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-2">Data do Registro</p>
                                    <p className="text-sm font-black uppercase italic text-white leading-none tracking-tight">
                                        {new Date(filteredItems[selectedPhotoIndex].date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                                {studentName && (
                                    <>
                                        <div className="w-px h-8 bg-white/10 hidden md:block" />
                                        <div className="text-center hidden md:block">
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mb-2">Atleta</p>
                                            <p className="text-sm font-black uppercase italic text-emerald-500 leading-none tracking-tight">{studentName}</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Controls */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(null); }}
                                className="absolute top-6 right-6 w-14 h-14 flex items-center justify-center bg-black/50 hover:bg-black/80 border border-white/10 rounded-full transition-all z-50 text-white shadow-2xl backdrop-blur-md group"
                            >
                                <X className="w-7 h-7 drop-shadow-md group-hover:scale-110 transition-transform" />
                            </button>

                            {selectedPhotoIndex > 0 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(selectedPhotoIndex - 1); }}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-black/50 hover:bg-black/80 border border-white/10 rounded-full transition-all z-50 text-white shadow-2xl backdrop-blur-md group"
                                >
                                    <ChevronLeft className="w-8 h-8 drop-shadow-md group-hover:-translate-x-1 transition-transform" />
                                </button>
                            )}

                            {selectedPhotoIndex < filteredItems.length - 1 && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(selectedPhotoIndex + 1); }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center bg-black/50 hover:bg-black/80 border border-white/10 rounded-full transition-all z-50 text-white shadow-2xl backdrop-blur-md group"
                                >
                                    <ChevronRight className="w-8 h-8 drop-shadow-md group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
