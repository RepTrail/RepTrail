'use client'
import { Icon } from '@/components/store/base/icon'
import { Inline } from '@/components/store/base/layout'

import React from 'react'
import { Trophy, Activity, Camera } from 'lucide-react'
import { ShareTransformation } from '@/components/store/advanced/student-share-transformation'
import { UnifiedProgressGallery } from '@/components/store/advanced/unified-progress-gallery'
import { ProgressPhotoUpload } from '@/components/store/advanced/student-photo-upload'
import { Stack } from '@/components/store/base/stack'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Badge } from '@/components/store/base/badge'
import { Img } from '@/components/store/base/img'
import { GlassPanel } from '@/components/store/base/surface'

import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { EmptyState } from '@/components/store/intermediary/empty-state'

interface Props {
    studentId: string
    isOwner: boolean
    studentName: string
    photos: any[]
    isStudentView?: boolean
}

export function StudentPublicPhotos({ studentId, isOwner, studentName, photos, isStudentView = false }: Props) {
    const oldestPhoto = photos && photos.length > 0 ? photos[photos.length - 1] : null
    const newestPhoto = photos && photos.length > 0 ? photos[0] : null

    return (
        <Stack gap={STORE_TOKENS.SPACING.EMPTY_STATE} fullWidth>
            {/* Conditional upload section for internal student view */}
            {isStudentView && (
                <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={Camera} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Novo Registro"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Envie suas fotos para avaliação."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                        <ProgressPhotoUpload studentId={studentId} existingPhotos={photos} />
                    </GlassPanel>
                  </Stack>
        </Stack>
            )}
            <Grid cols={{ base: 1, lg: 2 }} gap={STORE_TOKENS.SPACING.EMPTY_STATE}>

                {/* ── Before vs After Section ──────────────────────────────── */}
                <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={Trophy} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Antes vs Depois"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Contraste visual entre o ponto de partida e a evolução mais recente."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    {photos.length > 0 ? (
                        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                            <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                                <Grid cols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                    {/* Before Photo */}
                                    <Box
                                        position="relative"
                                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                        overflow="hidden"
                                        bg={STORE_TOKENS.COLORS.BACKGROUND}
                                        bgOpacity={STORE_TOKENS.OPACITY.SHELF}
                                        aspectRatio="3/4"
                                    >
                                        {oldestPhoto ? (
                                            <Img
                                                src={oldestPhoto.front_url}
                                                alt="Ponto de Partida"
                                                fullWidth
                                                fullHeight
                                                objectFit="cover"
                                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                                transition
                                            />
                                        ) : (
                                            <Box
                                                fullWidth
                                                height="full"
                                                display="flex"
                                                align="center"
                                                justify="center"
                                            >
                                                <Font
                                                    variant="sub-tiny"
                                                    weight="black"
                                                    italic
                                                    uppercase
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                                    }}>
                                                    Sem foto
                                                </Font>
                                            </Box>
                                        )}
                                        {/* Positioned Overlay Badge */}
                                        <Box
                                            position="absolute"
                                            top={2.5}
                                            left={2.5}
                                        >
                                            <Badge label="Início" color={STORE_TOKENS.COLORS.BRAND} variant="solid" size="xs" />
                                        </Box>
                                    </Box>

                                    {/* After Photo */}
                                    <Box
                                        position="relative"
                                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                        overflow="hidden"
                                        bg={STORE_TOKENS.COLORS.BACKGROUND}
                                        bgOpacity={STORE_TOKENS.OPACITY.SHELF}
                                        aspectRatio="3/4"
                                        border={true}
                                        borderColor={STORE_TOKENS.COLORS.BRAND}
                                        borderOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                                    >
                                        {newestPhoto ? (
                                            <Img
                                                src={newestPhoto.front_url}
                                                alt="Status Atual"
                                                fullWidth
                                                fullHeight
                                                objectFit="cover"
                                                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                                transition
                                            />
                                        ) : (
                                            <Box
                                                fullWidth
                                                height="full"
                                                display="flex"
                                                align="center"
                                                justify="center"
                                            >
                                                <Font
                                                    variant="sub-tiny"
                                                    weight="black"
                                                    italic
                                                    uppercase
                                                    {...{
                                                        color: STORE_TOKENS.COLORS.TEXT.DIM,
                                                    }}>
                                                    Sem foto
                                                </Font>
                                            </Box>
                                        )}
                                        {/* Positioned Overlay Badge */}
                                        <Box
                                            position="absolute"
                                            top={2.5}
                                            left={2.5}
                                        >
                                            <Badge label="Atual" color={STORE_TOKENS.COLORS.SUCCESS} variant="solid" size="xs" />
                                        </Box>
                                    </Box>
                                </Grid>

                                {/* Share transformation trigger below the photos comparison, spanning full width */}
                                {oldestPhoto && newestPhoto && (
                                    <ShareTransformation
                                        studentName={studentName}
                                        beforeUrl={oldestPhoto.front_url}
                                        afterUrl={newestPhoto.front_url}
                                        beforeDate={oldestPhoto.created_at}
                                        afterDate={newestPhoto.created_at}
                                        fullWidth={true}
                                    />
                                )}
                            </Stack>
                        </GlassPanel>
                    ) : (
                        <EmptyState
                            icon={Trophy}
                            title="SEM FOTOS DE EVOLUÇÃO"
                            description="Envie fotos de progresso para acompanhar a sua evolução visual de antes e depois."
                        />
                    )}
                  </Stack>
        </Stack>

                {/* ── Gallery Section ──────────────────────────────────────── */}
                <Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={Activity} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{"Galeria de Progresso"}</Font>
                    </Inline>
                    <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{"Histórico completo de fotos de acompanhamento físico do aluno."}</Font>
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                    {photos.length > 0 ? (
                        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER}>
                            <UnifiedProgressGallery
                                photos={photos || []}
                                mode={isStudentView ? 'student' : 'public'}
                                studentName={studentName}
                                studentId={studentId}
                            />
                        </GlassPanel>
                    ) : (
                        <EmptyState
                            icon={Camera}
                            title="NENHUMA FOTO ENCONTRADA"
                            description="Nenhum registro de progresso físico foi anexado a este perfil."
                        />
                    )}
                  </Stack>
        </Stack>
            </Grid>
        </Stack>
    );
}
