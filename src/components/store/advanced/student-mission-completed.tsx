'use client'

import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

// Design System Primitives
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function MissionCompletedView() {
    return (
        <Stack
            align="center"
            justify="center"
            flex1
            padding={STORE_TOKENS.PADDING.CONTAINER}
            gap={STORE_TOKENS.SPACING.SECTION}
            minHeight="screen"
        >
            <Box position="relative">
                <Box
                    position="absolute"
                    pin="inset"
                    rounded={STORE_TOKENS.RADIUS.FULL}
                />
                <Surface
                    variant="tonal-zinc"
                    padding={STORE_TOKENS.PADDING.CONTAINER}
                    rounded={STORE_TOKENS.RADIUS.FULL}
                    border="standard"
                    borderColor={STORE_TOKENS.COLORS.SUCCESS}
                    borderOpacity={STORE_TOKENS.OPACITY.HIGH}
                    shadow="xl"
                >
                    <Box>
                        <Icon icon={CheckCircle} size="lg" color={STORE_TOKENS.COLORS.SUCCESS} />
                    </Box>
                </Surface>
            </Box>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                <Font
                    variant="h2"
                    weight="black"
                    uppercase
                    italic
                    tracking="tight"
                    align="center"
                    {...{
                        color: "white",
                    }}>
                    Missão de Hoje <Font
                    variant="h2"
                    {...{
                        color: "success",
                    }}>Concluída!</Font> ✅
                </Font>
                <Box maxWidth="sm">
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        align="center"
                        {...{
                            color: "zinc-500",
                        }}>
                        Você já finalizou este treino hoje. Aproveite o descanso e volte amanhã para mais resultados!
                    </Font>
                </Box>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} width="full" maxWidth="sm">
                <Box width="full">
                    <Link href="/dashboard/student/workouts" passHref>
                        <Button variant="white" fullWidth text="Voltar aos Treinos" />
                    </Link>
                </Box>
                <Box width="full">
                    <Link href="/dashboard/student" passHref>
                        <Button variant="ghost" fullWidth text="Ir para Dashboard" />
                    </Link>
                </Box>
            </Stack>
        </Stack>
    );
}
