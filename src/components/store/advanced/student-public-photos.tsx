'use client'

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
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

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
                <RegistrySection
                    title="Novo Registro"
                    subtitle="Envie suas fotos para avaliação."
                    icon={Camera}
                >
                    <GlassPanel padding={5}>
                        <ProgressPhotoUpload studentId={studentId} />
                    </GlassPanel>
                </RegistrySection>
            )}

            <Grid cols={{ base: 1, lg: 2 }} gap={STORE_TOKENS.SPACING.EMPTY_STATE}>

                {/* ── Before vs After Section ──────────────────────────────── */}
                <RegistrySection
                    title="Antes vs Depois"
                    subtitle="Contraste visual entre o ponto de partida e a evolução mais recente."
                    icon={Trophy}
                >
                    <GlassPanel padding={5}>
                        <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                            <Grid cols={2} gap={STORE_TOKENS.SPACING.CONTAINER}>
                                {/* Before Photo */}
                                <Box
                                    position="relative"
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    overflow="hidden"
                                    bg="zinc"
                                    bgOpacity={90}
                                    className="aspect-[3/4]"
                                >
                                    {oldestPhoto ? (
                                        <Img
                                            src={oldestPhoto.front_url}
                                            alt="Ponto de Partida"
                                            fullWidth
                                            fullHeight
                                            objectFit="cover"
                                            rounded="system"
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
                                            <Font variant="sub-tiny" weight="black" italic uppercase color={STORE_TOKENS.COLORS.TEXT.DIM}>
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
                                        <Badge label="Início" color="orange" variant="solid" size="xs" />
                                    </Box>
                                </Box>

                                {/* After Photo */}
                                <Box
                                    position="relative"
                                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                                    overflow="hidden"
                                    bg="zinc"
                                    bgOpacity={90}
                                    className="aspect-[3/4]"
                                    border={true}
                                    borderColor="primary"
                                    borderOpacity={20}
                                >
                                    {newestPhoto ? (
                                        <Img
                                            src={newestPhoto.front_url}
                                            alt="Status Atual"
                                            fullWidth
                                            fullHeight
                                            objectFit="cover"
                                            rounded="system"
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
                                            <Font variant="sub-tiny" weight="black" italic uppercase color={STORE_TOKENS.COLORS.TEXT.DIM}>
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
                                        <Badge label="Atual" color="emerald" variant="solid" size="xs" />
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
                </RegistrySection>

                {/* ── Gallery Section ──────────────────────────────────────── */}
                <RegistrySection
                    title="Galeria de Progresso"
                    subtitle="Histórico completo de fotos de acompanhamento físico do aluno."
                    icon={Activity}
                >
                    <GlassPanel padding={5}>
                        <UnifiedProgressGallery
                            photos={photos || []}
                            mode={isStudentView ? 'student' : 'public'}
                            studentName={studentName}
                            studentId={studentId}
                        />
                    </GlassPanel>
                </RegistrySection>
            </Grid>
        </Stack>
    )
}
