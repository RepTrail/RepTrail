'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import { Activity } from 'lucide-react'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import Link from 'next/link'

export function InactiveTrainerCard({ trainerName }: { trainerName: string | null }) {
    return (
        <RegistryMain
            title="STATUS DO PLANO"
            subtitle="Atenção necessária: seu personal trainer está inativo."
            icon={Activity}
            contextLabel="Área do Aluno"
            showTabs={false}
        >
            <RegistrySection>
                <Box
                    position="relative"
                    overflow="hidden"
                    padding={{ base: STORE_TOKENS.PADDING.CONTAINER, md: STORE_TOKENS.PADDING.EMPTY_STATE }}
                    bg={STORE_TOKENS.COLORS.BACKGROUND}
                    bgOpacity={STORE_TOKENS.OPACITY.SURFACE}
                    border
                    borderColor={STORE_TOKENS.COLORS.BACKGROUND}
                    borderOpacity={STORE_TOKENS.OPACITY.SUBTLE}
                    rounded={STORE_TOKENS.RADIUS.SYSTEM}
                    shadow="xl"
                    fullWidth
                >
                    {/* High-Fidelity Background Glow */}
                    <Box
                        position="absolute"
                        pin="inset"
                        pointerEvents="none"
                    />

                    <Stack
                        position="relative"
                        zIndex={STORE_TOKENS.Z_INDEX.CONTENT}
                        direction={{ base: 'col', md: 'row' }}
                        gap={STORE_TOKENS.SPACING.SECTION}
                        align="center"
                        fullWidth
                    >
                        <Stack
                            flex1
                            gap={STORE_TOKENS.SPACING.CONTAINER}
                            align={{ base: 'center', md: 'start' }}
                            textAlign={{ base: 'center', md: 'left' }}
                            fullWidth
                        >
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                                <Font
                                    variant="h1"
                                    weight="black"
                                    uppercase
                                    italic
                                    {...{
                                        color: "white",
                                    }}>Seu Personal 
                                    <Font
                                        variant="h1"
                                        weight="black"
                                        uppercase
                                        italic
                                        {...{
                                            color: "error",
                                        }}>
                                        ficou Inativo
                                    </Font>
                                </Font>
                                <Font
                                    variant="description"
                                    {...{
                                        color: "MUTED",
                                    }}>
                                    Infelizmente, seu personal trainer {trainerName} não utiliza mais a plataforma RepTrail.
                                    Para continuar seus treinos, você pode procurar um novo personal ou ativar o Auto-Training.
                                </Font>
                            </Stack>
                            <Stack
                                direction={{ base: 'row', md: 'col' }}
                                gap={STORE_TOKENS.SPACING.ELEMENT}
                                justify={{ base: 'center', md: 'start' }}
                                fullWidth
                            >
                                <Link href="/buscar-personal">
                                    <Button
                                        variant="white"
                                        size="lg"
                                        fullWidth={{ base: true, sm: false }}
                                        paddingY={STORE_TOKENS.PADDING.CONTAINER}
                                    >
                                        Procurar Novo Personal
                                    </Button>
                                </Link>
                                <Link href="/dashboard/student/plans">
                                    <Button
                                        variant="outline-primary"
                                        size="lg"
                                        fullWidth={{ base: true, sm: false }}
                                        paddingY={STORE_TOKENS.PADDING.CONTAINER}
                                    >
                                        Ativar Auto-Training
                                    </Button>
                                </Link>
                            </Stack>
                        </Stack>
                    </Stack>
                </Box>
            </RegistrySection>
        </RegistryMain>
    );
}
