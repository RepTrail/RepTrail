'use client'

import React, { useState, useTransition } from 'react'
import { Camera, Calendar, X, Maximize2, Pencil, Check, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { Input } from '@/components/store/base/input'
import { useQueryClient } from '@tanstack/react-query'
import { useOptimisticMutation } from '@/hooks/use-optimistic-mutation'
import { useToast } from '@/hooks/use-toast'
import { ENTITIES } from '@/lib/outbox-db'
import { QUERY_KEYS } from '@/lib/query-keys'
import Image from 'next/image'

// Design System Imports
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Separator } from '@/components/store/base/separator'
import { Modal } from '@/components/store/advanced/modal'

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
    studentId?: string
}

export function UnifiedProgressGallery({ photos, mode = 'public', studentName, studentId }: UnifiedProgressGalleryProps) {
    const [activeFilter, setActiveFilter] = useState<PhotoType | 'all'>('all')
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
    const [hoveredSetId, setHoveredSetId] = useState<string | null>(null)
    const [editingSetId, setEditingSetId] = useState<string | null>(null)
    const [editDate, setEditDate] = useState('')
    const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
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

    const queryClient = useQueryClient()

    const { mutate: deleteMutate } = useOptimisticMutation({
        actionName: 'delete-progress-photo',
        entity: ENTITIES.PROGRESS_PHOTO,
        entityId: 'delete-photo',
        queryKey: QUERY_KEYS.student.photos(studentId || 'me'),
        mutationFn: async (variables: { photoId: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(QUERY_KEYS.student.photos(studentId || 'me'))
            queryClient.setQueryData(QUERY_KEYS.student.photos(studentId || 'me'), (old: any) => 
                Array.isArray(old) ? old.filter((item: any) => item.id !== variables.photoId) : old
            )
            return { previous }
        },
        onSuccess: () => {
            toast({ title: "Removido!", description: "O registro de fotos está sendo removido." })
        },
        onError: (err, variables, ctx) => {
            queryClient.setQueryData(QUERY_KEYS.student.photos(studentId || 'me'), ctx?.previous)
            toast({ variant: "destructive", title: "Erro", description: "Falha ao remover." })
        }
    })

    const { mutate: updateDateMutate } = useOptimisticMutation({
        actionName: 'update-progress-photo-date',
        entity: ENTITIES.PROGRESS_PHOTO,
        entityId: 'update-photo',
        queryKey: QUERY_KEYS.student.photos(studentId || 'me'),
        mutationFn: async (variables: { photoId: string, newDate: string }) => variables,
        onMutate: (variables) => {
            const previous = queryClient.getQueryData(QUERY_KEYS.student.photos(studentId || 'me'))
            queryClient.setQueryData(QUERY_KEYS.student.photos(studentId || 'me'), (old: any) => 
                Array.isArray(old) ? old.map((item: any) => item.id === variables.photoId ? { ...item, created_at: variables.newDate } : item) : old
            )
            setEditingSetId(null)
            return { previous }
        },
        onSuccess: () => {
            toast({ title: "Data atualizada!", description: "A data será refletida em todo o sistema em instantes." })
        },
        onError: (err, variables, ctx) => {
            queryClient.setQueryData(QUERY_KEYS.student.photos(studentId || 'me'), ctx?.previous)
            toast({ variant: "destructive", title: "Erro", description: "Falha ao atualizar data." })
        }
    })

    function handleDelete(setId: string) {
        setDeleteTargetId(setId)
    }

    function confirmDelete() {
        if (!deleteTargetId) return
        deleteMutate({ photoId: deleteTargetId })
        setDeleteTargetId(null)
    }

    function handleDateSave(setId: string) {
        if (!editDate) return
        updateDateMutate({ photoId: setId, newDate: new Date(editDate).toISOString() })
    }

    function startEditing(id: string, currentDate: string) {
        setEditingSetId(id)
        setEditDate(new Date(currentDate).toISOString().split('T')[0])
    }

    const canEdit = mode === 'student'

    if (photos.length === 0) {
        return (
            <Box
                padding={10}
                display="flex"
                direction="col"
                align="center"
                justify="center"
                rounded="system"
                border
                borderColor="zinc"
                borderOpacity={10}
                bg="zinc"
                bgOpacity={5}
                gap={2.5}
                fullWidth
            >
                <Icon icon={Camera} size="lg" color="zinc-400" opacity={20} />
                <Font variant="sub-tiny" weight="black" uppercase italic tracking="widest" color="zinc-400">
                    Nenhuma foto encontrada
                </Font>
            </Box>
        )
    }

    const renderPhotoCard = (item: { url: string, type: PhotoType, date: string, setId: string }, index: number) => {
        return (
            <Box
                key={`${item.url}-${index}`}
                display="flex"
                direction="col"
                gap={2.5}
                onMouseEnter={() => setHoveredSetId(item.setId)}
                onMouseLeave={() => setHoveredSetId(null)}
                group
            >
                <Box
                    onClick={() => setSelectedPhotoIndex(index)}
                    position="relative"
                    rounded="system"
                    overflow="hidden"
                    border
                    borderColor="white"
                    borderOpacity={5}
                    bg="zinc"
                    cursor="pointer"
                    className="aspect-[3/4] transition-all hover:scale-[0.98] shadow-xl group-hover:border-primary/30"
                >
                    <Image
                        src={item.url}
                        alt="Progresso"
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    />
                    <Box
                        position="absolute"
                        pin="bottom"
                        padding={2.5}
                        bg="black"
                        bgOpacity={90}
                        className="translate-y-2 group-hover:translate-y-0 transition-transform"
                    >
                        <Box display="flex" align="center" justify="between" gap={2.5}>
                            <Stack gap={2.5}>
                                <Font variant="sub-tiny" weight="black" color="primary" uppercase tracking="widest">
                                    {typeLabels[item.type]}
                                </Font>
                                <Font variant="sub-tiny" weight="bold" color="white" uppercase tracking="tight">
                                    {new Date(item.date).toLocaleDateString()}
                                </Font>
                            </Stack>
                            <Icon icon={Maximize2} size="xs" color="white" opacity={0} className="group-hover:opacity-100 transition-opacity" />
                        </Box>
                    </Box>
                </Box>
            </Box>
        )
    }

    return (
        <Stack gap={5} fullWidth>
            {/* Header / Filter Section */}
            <Box
                display="flex"
                direction={{ base: 'col', md: 'row' }}
                align={{ base: 'stretch', md: 'center' }}
                justify="between"
                gap={5}
                padding={0}
            >
                <Box display="flex" align="center" gap={2.5} wrap="wrap" fullWidth>
                    <Icon icon={Filter} size="xs" color="zinc-400" className="shrink-0 mr-1" />
                    {filters.map((f) => {
                        const isActive = activeFilter === f.value
                        return (
                            <Button
                                key={f.value}
                                variant={isActive ? 'outline-primary' : 'outline-zinc'}
                                size="xs"
                                flex1={true}
                                onClick={() => setActiveFilter(f.value)}
                            >
                                {f.label}
                            </Button>
                        )
                    })}
                </Box>

            </Box>

            <Separator opacity={10} />

            {/* Gallery Content */}
            {activeFilter === 'all' ? (
                <Stack gap={5} fullWidth>
                    {sortedSets.map((set, idx) => {
                        const isEditing = editingSetId === set.id
                        const sessionPhotos = []
                        if (set.front_url) sessionPhotos.push({ url: set.front_url, type: 'front_url' as PhotoType, date: set.created_at, setId: set.id })
                        if (set.back_url) sessionPhotos.push({ url: set.back_url, type: 'back_url' as PhotoType, date: set.created_at, setId: set.id })
                        if (set.side_right_url) sessionPhotos.push({ url: set.side_right_url, type: 'side_right_url' as PhotoType, date: set.created_at, setId: set.id })
                        if (set.side_left_url) sessionPhotos.push({ url: set.side_left_url, type: 'side_left_url' as PhotoType, date: set.created_at, setId: set.id })

                        return (
                            <React.Fragment key={set.id}>
                                {idx > 0 && <Separator opacity={5} />}
                                <Stack gap={5} fullWidth>
                                    {/* Session Header */}
                                    <Box
                                        display="flex"
                                        align="center"
                                        justify="between"
                                        gap={5}
                                        fullWidth
                                    >
                                        <Box display="flex" align="center" gap={2.5}>
                                            <Box
                                                padding={2.5}
                                                rounded="system"
                                                bg="primary"
                                                bgOpacity={10}
                                                display="flex"
                                                align="center"
                                                justify="center"
                                                className="shrink-0"
                                            >
                                                <Icon icon={Calendar} size="md" color="primary" />
                                            </Box>
                                            <Font variant="body" weight="black" uppercase italic color="white">
                                                Atualização de {new Date(set.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                                            </Font>
                                        </Box>

                                        <Box display="flex" align="center" gap={2.5}>
                                            {canEdit && (
                                                <>
                                                    {isEditing ? (
                                                        <Box display="flex" align="center" gap={2.5} className="animate-in fade-in slide-in-from-right-4 duration-300">
                                                            <Input
                                                                type="date"
                                                                value={editDate}
                                                                onChange={(e) => setEditDate(e.target.value)}
                                                                width="150px"
                                                                className="!h-8 text-[11px]"
                                                            />
                                                            <Box display="flex" gap={2.5}>
                                                                <Button
                                                                    size="sm"
                                                                    variant="primary"
                                                                    onClick={() => handleDateSave(set.id)}
                                                                >
                                                                    Salvar
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="close"
                                                                    isIconOnly
                                                                    rounded="full"
                                                                    onClick={() => setEditingSetId(null)}
                                                                >
                                                                    <Icon icon={X} size="xs" />
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    ) : (
                                                        <Box display="flex" align="center" gap={2.5}>
                                                            <Button
                                                                variant="outline-zinc"
                                                                size="sm"
                                                                onClick={() => startEditing(set.id, set.created_at)}
                                                                gap={2.5}
                                                            >
                                                                <Icon icon={Pencil} size="xs" />
                                                                Editar Data
                                                            </Button>
                                                            <Button
                                                                variant="outline-zinc"
                                                                size="sm"
                                                                isIconOnly
                                                                rounded="full"
                                                                onClick={() => handleDelete(set.id)}
                                                            >
                                                                <Icon icon={X} size="xs" />
                                                            </Button>
                                                        </Box>
                                                    )}
                                                </>
                                            )}
                                        </Box>
                                    </Box>

                                    {/* Photos Grid for this session (4 per row on md/lg screens) */}
                                    <Grid cols={{ base: 2, md: 4 }} gap={5}>
                                        {sessionPhotos.map((photo, pIdx) => {
                                            const globalIdx = allItems.findIndex(ai => ai.url === photo.url)
                                            return renderPhotoCard({ ...photo, date: set.created_at, setId: set.id }, globalIdx)
                                        })}
                                    </Grid>
                                </Stack>
                            </React.Fragment>
                        )
                    })}
                </Stack>
            ) : (
                /* Photos Grid for filtered view (4 per row on md/lg screens) */
                <Grid cols={{ base: 2, md: 4 }} gap={5}>
                    {filteredItems.map((item, i) => {
                        const isEditing = editingSetId === item.setId

                        return (
                            <Stack key={`${item.url}-${i}`} gap={2.5}>
                                {renderPhotoCard(item, i)}
                                {canEdit && (
                                    <Box display="flex" align="center" justify="between" padding={1}>
                                        {isEditing ? (
                                            <Box display="flex" align="center" gap={2.5} fullWidth className="animate-in fade-in zoom-in duration-300">
                                                <Input
                                                    type="date"
                                                    value={editDate}
                                                    onChange={(e) => setEditDate(e.target.value)}
                                                    className="h-7 px-2 text-[10px] bg-zinc-900 border-zinc-800 text-white rounded-system"
                                                />
                                                <Box display="flex" gap={2.5}>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-emerald"
                                                        onClick={() => handleDateSave(item.setId)}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        <Icon icon={Check} size="xs" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-red"
                                                        onClick={() => setEditingSetId(null)}
                                                        className="h-7 w-7 p-0"
                                                    >
                                                        <Icon icon={X} size="xs" />
                                                    </Button>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Box display="flex" align="center" justify="between" fullWidth className="group/date">
                                                <Font variant="sub-tiny" weight="black" color="zinc-400" uppercase tracking="widest" className="flex items-center gap-1">
                                                    <Icon icon={Calendar} size="xs" color="zinc-400" />
                                                    {new Date(item.date).toLocaleDateString()}
                                                </Font>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => startEditing(item.setId, item.date)}
                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                                                >
                                                    <Icon icon={Pencil} size="xs" />
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                )}
                            </Stack>
                        )
                    })}
                </Grid>
            )}

            {/* Lightbox Modal */}
            <Modal
                isOpen={selectedPhotoIndex !== null}
                onClose={() => setSelectedPhotoIndex(null)}
                title={selectedPhotoIndex !== null ? typeLabels[filteredItems[selectedPhotoIndex].type] : 'Visualização'}
                subtitle={selectedPhotoIndex !== null ? new Date(filteredItems[selectedPhotoIndex].date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}
                icon={Camera}
                hideCancel={true}
                confirmLabel="Fechar"
                onConfirm={() => setSelectedPhotoIndex(null)}
                noPadding
            >
                {selectedPhotoIndex !== null && (
                    <Box
                        position="relative"
                        display="flex"
                        align="center"
                        justify="center"
                        fullWidth
                        bg="zinc"
                        bgOpacity={95}
                        className="min-h-[50vh] md:min-h-[60vh] max-h-[70vh] overflow-hidden"
                    >
                        <div className="relative aspect-[3/4] w-full max-w-sm md:max-w-md overflow-hidden rounded-system my-5">
                            <Image
                                src={filteredItems[selectedPhotoIndex].url}
                                alt="Visualização"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Controls/Navigation inside content box */}
                        {selectedPhotoIndex > 0 && (
                            <Box
                                position="absolute"
                                left={2.5}
                                top="50%"
                                className="-translate-y-1/2"
                            >
                                <Button
                                    variant="outline-zinc"
                                    isIconOnly
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedPhotoIndex(selectedPhotoIndex - 1)
                                    }}
                                >
                                    <Icon icon={ChevronLeft} size="sm" />
                                </Button>
                            </Box>
                        )}

                        {selectedPhotoIndex < filteredItems.length - 1 && (
                            <Box
                                position="absolute"
                                right={2.5}
                                top="50%"
                                className="-translate-y-1/2"
                            >
                                <Button
                                    variant="outline-zinc"
                                    isIconOnly
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedPhotoIndex(selectedPhotoIndex + 1)
                                    }}
                                >
                                    <Icon icon={ChevronRight} size="sm" />
                                </Button>
                            </Box>
                        )}

                        {/* Extra athlete info */}
                        {studentName && (
                            <Box
                                position="absolute"
                                bottom={2.5}
                                left="50%"
                                className="-translate-x-1/2"
                                bg="black"
                                bgOpacity={50}
                                padding={2.5}
                                rounded="system"
                            >
                                <Stack direction="row" align="center" gap={2.5}>
                                    <Font variant="sub-tiny" color="zinc-400" weight="bold" uppercase tracking="widest">Atleta:</Font>
                                    <Font variant="sub-tiny" weight="black" uppercase italic color="primary">
                                        {studentName}
                                    </Font>
                                </Stack>
                            </Box>
                        )}
                    </Box>
                )}
            </Modal>

            {/* Deletion Confirmation Modal */}
            <Modal
                isOpen={deleteTargetId !== null}
                onClose={() => setDeleteTargetId(null)}
                title="Excluir Registro"
                subtitle="Esta ação removerá permanentemente esta atualização de fotos do seu histórico."
                icon={X}
                variant="red"
                confirmLabel="Remover"
                cancelLabel="Cancelar"
                onConfirm={confirmDelete}
            >
                <Box padding={0}>
                    <Font variant="body" color="zinc-400" align="center">
                        Tem certeza que deseja remover este registro de fotos? Essa ação não poderá ser desfeita.
                    </Font>
                </Box>
            </Modal>
        </Stack>
    )
}
