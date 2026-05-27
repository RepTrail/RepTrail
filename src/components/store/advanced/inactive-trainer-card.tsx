'use client'

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
                    padding={{ base: 'container', md: 'empty_state' }}
                    bg="zinc"
                    bgOpacity={95}
                    border
                    borderColor="zinc"
                    borderOpacity={10}
                    rounded="system"
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
                        zIndex={10}
                        direction={{ base: 'col', md: 'row' }}
                        gap="section"
                        align="center"
                        fullWidth
                    >
                        <Stack
                            flex1
                            gap="container"
                            align={{ base: 'center', md: 'start' }}
                            textAlign={{ base: 'center', md: 'left' }}
                            fullWidth
                        >
                            <Stack gap="element" fullWidth>
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
                                gap="element"
                                justify={{ base: 'center', md: 'start' }}
                                fullWidth
                            >
                                <Link href="/buscar-personal" passHref legacyBehavior>
                                    <Button
                                        variant="white"
                                        size="lg"
                                        fullWidth={{ base: true, sm: false }}
                                        paddingY="container"
                                    >
                                        Procurar Novo Personal
                                    </Button>
                                </Link>
                                <Link href="/dashboard/student/plans" passHref legacyBehavior>
                                    <Button
                                        variant="outline-primary"
                                        size="lg"
                                        fullWidth={{ base: true, sm: false }}
                                        paddingY="container"
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
