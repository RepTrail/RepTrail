'use client'

import React, { useState, useTransition } from 'react'
import { Camera, Calendar, X, Maximize2, Pencil, Check, ChevronLeft, ChevronRight, Filter } from 'lucide-react'
import { Input } from '@/components/store/base/input'
import { useQueryClient } from '@/lib/dal'
import { useOptimisticMutation } from '@/lib/dal'
import { useToast } from '@/components/store/hooks/use-toast'
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
import { Badge } from '@/components/store/base/badge'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'

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
            <EmptyState
                icon={Camera}
                title="NENHUMA FOTO ENCONTRADA"
                description="Nenhum registro de progresso físico foi anexado a este perfil."
            />
        )
    }

    const renderPhotoCard = (item: { url: string, type: PhotoType, date: string, setId: string }, index: number) => {
        return (
            <Box
                key={`${item.url}-${index}`}
                display="flex"
                direction="col"
                gap={STORE_TOKENS.SPACING.ELEMENT}
                onMouseEnter={() => setHoveredSetId(item.setId)}
                onMouseLeave={() => setHoveredSetId(null)}
                group
            >
                <Box
                    onClick={() => setSelectedPhotoIndex(index)}
                    position="relative"
                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    overflow="hidden"
                    border
                    borderColor={STORE_TOKENS.COLORS.WHITE}
                    borderOpacity={STORE_TOKENS.OPACITY.LOW}
                    bg={STORE_TOKENS.COLORS.BACKGROUND}
                    cursor="pointer"
                    aspectRatio="3/4"
                    transition
                    hoverScale={98}
                    shadow="xl"
                    groupHoverBorderColor={STORE_TOKENS.COLORS.BRAND}
                >
                    <Image
                        src={item.url}
                        alt="Progresso"
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        {...{
                            className: "object-cover grayscale group-hover:grayscale-0 transition-all duration-700",
                        }} />
                    {/* Floating Badge Overlay (Top Left) */}
                    <Box position="absolute" top={2.5} left={2.5} pointerEvents="none">
                        <Badge variant="solid" color={STORE_TOKENS.COLORS.BRAND} label={typeLabels[item.type]} size="xs" />
                    </Box>

                    {/* Centered Hover Zoom Icon Overlay */}
                    <Box
                        position="absolute"
                        pin="inset"
                        display="flex"
                        align="center"
                        justify="center"
                        bg={STORE_TOKENS.COLORS.BLACK}
                        bgOpacity={STORE_TOKENS.OPACITY.HIGH}
                        opacity={STORE_TOKENS.OPACITY.NONE}
                        groupHoverOpacity={STORE_TOKENS.OPACITY.FULL}
                        transition
                        pointerEvents="none"
                    >
                        <Box
                            width="40px"
                            height="40px"
                            rounded={STORE_TOKENS.RADIUS.FULL}
                            bg={STORE_TOKENS.COLORS.BRAND}
                            bgOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                            border={true}
                            borderColor={STORE_TOKENS.COLORS.BRAND}
                            borderOpacity={STORE_TOKENS.OPACITY.MODAL}
                            display="flex"
                            align="center"
                            justify="center"
                            scale={90}
                            groupHoverScale={100}
                            transition
                        >
                            <Icon icon={Maximize2} size="xs" color={STORE_TOKENS.COLORS.BRAND} />
                        </Box>
                    </Box>
                </Box>
            </Box>
        );
    }

    return (
        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
            {/* Header / Filter Section */}
            <Box
                display="flex"
                direction={{ base: 'col', md: 'row' }}
                align={{ base: 'stretch', md: 'center' }}
                justify="between"
                gap={STORE_TOKENS.SPACING.CONTAINER}
                padding={STORE_TOKENS.PADDING.NONE}
            >
                <Box display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} wrap="wrap" fullWidth>
                    <Icon icon={Filter} size="xs" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} />
                    {filters.map((f) => {
                        const isActive = activeFilter === f.value
                        return (
                            <Box key={f.value} grow={1} shrink={0} display="flex">
                                <Button
                                    variant={isActive ? 'outline-primary' : 'outline-zinc'}
                                    size="xs"
                                    fullWidth={true}
                                    onClick={() => setActiveFilter(f.value)}
                                >
                                    {f.label}
                                </Button>
                            </Box>
                        )
                    })}
                </Box>

            </Box>
            <Separator opacity={STORE_TOKENS.OPACITY.SUBTLE} />
            {/* Gallery Content */}
            {activeFilter === 'all' ? (
                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                    {sortedSets.map((set, idx) => {
                        const isEditing = editingSetId === set.id
                        const sessionPhotos = []
                        if (set.front_url) sessionPhotos.push({ url: set.front_url, type: 'front_url' as PhotoType, date: set.created_at, setId: set.id })
                        if (set.back_url) sessionPhotos.push({ url: set.back_url, type: 'back_url' as PhotoType, date: set.created_at, setId: set.id })
                        if (set.side_right_url) sessionPhotos.push({ url: set.side_right_url, type: 'side_right_url' as PhotoType, date: set.created_at, setId: set.id })
                        if (set.side_left_url) sessionPhotos.push({ url: set.side_left_url, type: 'side_left_url' as PhotoType, date: set.created_at, setId: set.id })

                        return (
                            <React.Fragment key={set.id}>
                                {idx > 0 && <Separator opacity={STORE_TOKENS.OPACITY.LOW} />}
                                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                                    {/* Session Header */}
                                    <Stack
                                        direction={{ base: 'col', md: 'row' }}
                                        align={{ base: 'start', md: 'center' }}
                                        justify="between"
                                        gap={STORE_TOKENS.SPACING.CONTAINER}
                                        fullWidth
                                    >
                                        <Box display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Box
                                                padding={STORE_TOKENS.PADDING.ELEMENT}
                                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                                bg={STORE_TOKENS.COLORS.BRAND}
                                                bgOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                                                display="flex"
                                                align="center"
                                                justify="center"
                                            >
                                                <Icon icon={Calendar} size="md" color={STORE_TOKENS.COLORS.BRAND} />
                                            </Box>
                                            <Font
                                                variant="body"
                                                weight="black"
                                                uppercase
                                                italic
                                                {...{
                                                    color: "white",
                                                }}>
                                                Atualização de {new Date(set.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                                            </Font>
                                        </Box>

                                        <Box display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            {canEdit && (
                                                <>
                                                {
                                                    isEditing?(
                                                        <Box display = "flex" align = "center" gap = { STORE_TOKENS.SPACING.ELEMENT } animateIn = "slide-right" >
                                                            <Input
                                                                type="date"
                                                                value={editDate}
                                                                onChange={(e) => setEditDate(e.target.value)}
                                                                width="150px"
                                                                size="sm"
                                                            />
                                                            <Box display="flex" gap={STORE_TOKENS.SPACING.ELEMENT}>
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
                                                                    rounded={STORE_TOKENS.RADIUS.FULL}
                                                                    onClick={() => setEditingSetId(null)}
                                                                >
                                                                    <Icon icon={X} size="xs" />
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                        ) : (
                                        <Box display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Button
                                                variant="outline-zinc"
                                                size="sm"
                                                onClick={() => startEditing(set.id, set.created_at)}
                                                gap={STORE_TOKENS.SPACING.ELEMENT}
                                            >
                                                <Icon icon={Pencil} size="xs" />
                                                Editar Data
                                            </Button>
                                            <Button
                                                variant="outline-zinc"
                                                size="sm"
                                                isIconOnly
                                                rounded={STORE_TOKENS.RADIUS.FULL}
                                                onClick={() => handleDelete(set.id)}
                                            >
                                                <Icon icon={X} size="xs" />
                                            </Button>
                                        </Box>
                                                    )}
                                                </>
                                            )}
                                    </Box>
                                </Stack>

                                {/* Photos Grid for this session (4 per row on md/lg screens) */}
                                <Grid cols={{ base: 1, md: 4 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    {sessionPhotos.map((photo, pIdx) => {
                                        const globalIdx = allItems.findIndex(ai => ai.url === photo.url)
                                        return renderPhotoCard({ ...photo, date: set.created_at, setId: set.id }, globalIdx)
                                    })}
                                </Grid>
                            </Stack>
                            </React.Fragment>
            );
})}
        </Stack >
    ) : (
        /* Photos Grid for filtered view (4 per row on md/lg screens) */
        (<Grid cols={{ base: 1, md: 4 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
            {filteredItems.map((item, i) => {
                const isEditing = editingSetId === item.setId

                return (
                    <Stack key={`${item.url}-${i}`} gap={STORE_TOKENS.SPACING.ELEMENT}>
                        {renderPhotoCard(item, i)}
                        {canEdit && (
                            <Box display="flex" align="center" justify="between" padding={STORE_TOKENS.PADDING.NONE}>
                                {isEditing ? (
                                    <Box display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth animateIn="zoom">
                                        <Input
                                            type="date"
                                            value={editDate}
                                            onChange={(e) => setEditDate(e.target.value)}
                                            size="sm"
                                            color={STORE_TOKENS.COLORS.BACKGROUND}
                                        />
                                        <Box display="flex" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Button
                                                size="xs"
                                                isIconOnly
                                                variant="outline-emerald"
                                                onClick={() => handleDateSave(item.setId)}
                                            >
                                                <Icon icon={Check} size="xs" />
                                            </Button>
                                            <Button
                                                size="xs"
                                                isIconOnly
                                                variant="outline-red"
                                                onClick={() => setEditingSetId(null)}
                                            >
                                                <Icon icon={X} size="xs" />
                                            </Button>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Box display="flex" align="center" justify="between" fullWidth group>
                                        <Box display="flex" align="center" gap={STORE_TOKENS.SPACING.NONE}>
                                            <Icon icon={Calendar} size="xs" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} />
                                            <Font
                                                variant="sub-tiny"
                                                weight="black"
                                                uppercase
                                                tracking="widest"
                                                {...{
                                                    color: "zinc-400",
                                                }}>
                                                {new Date(item.date).toLocaleDateString()}
                                            </Font>
                                        </Box>
                                        <Box opacity={STORE_TOKENS.OPACITY.NONE} groupHoverOpacity={STORE_TOKENS.OPACITY.FULL} transition>
                                            <Button
                                                variant="ghost"
                                                size="xs"
                                                isIconOnly
                                                onClick={() => startEditing(item.setId, item.date)}
                                            >
                                                <Icon icon={Pencil} size="xs" />
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        )}
                    </Stack>
                );
            })}
        </Grid>)
    )
}
{/* Lightbox Modal */ }
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
            bg={STORE_TOKENS.COLORS.BACKGROUND}
            bgOpacity={STORE_TOKENS.OPACITY.SHELF}
            padding={STORE_TOKENS.PADDING.CONTAINER}
        >
            <Box
                position="relative"
                aspectRatio="3/4"
                fullWidth
                maxWidth={{ base: 'sm', md: 'md' }}
                overflow="hidden"
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
            >
                <Image
                    src={filteredItems[selectedPhotoIndex].url}
                    alt="Visualização"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    {...{
                        className: "object-cover",
                    }} />
            </Box>

            {/* Controls/Navigation inside content box */}
            {selectedPhotoIndex > 0 && (
                <Box
                    position="absolute"
                    left={2.5}
                    top={0}
                    bottom={0}
                    display="flex"
                    align="center"
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
                    top={0}
                    bottom={0}
                    display="flex"
                    align="center"
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
                    left={0}
                    right={0}
                    display="flex"
                    justify="center"
                    pointerEvents="none"
                >
                    <Box
                        bg={STORE_TOKENS.COLORS.BLACK}
                        bgOpacity={STORE_TOKENS.OPACITY.MODAL}
                        padding={STORE_TOKENS.PADDING.ELEMENT}
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                        pointerEvents="auto"
                    >
                        <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font
                                variant="sub-tiny"
                                weight="bold"
                                uppercase
                                tracking="widest"
                                {...{
                                    color: "zinc-400",
                                }}>Atleta:</Font>
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                italic
                                {...{
                                    color: "primary",
                                }}>
                                {studentName}
                            </Font>
                        </Stack>
                    </Box>
                </Box>
            )}
        </Box>
    )}
</Modal>
{/* Deletion Confirmation Modal */ }
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
    <Box padding={STORE_TOKENS.PADDING.NONE}>
        <Font
            variant="body"
            align="center"
            {...{
                color: "zinc-400",
            }}>
            Tem certeza que deseja remover este registro de fotos? Essa ação não poderá ser desfeita.
        </Font>
    </Box>
</Modal>
        </Stack >
    );
}
