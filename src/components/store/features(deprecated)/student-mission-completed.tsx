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
            style={{ minHeight: '80vh' }}
        >
            <Box position="relative">
                <Box 
                    position="absolute" 
                    pin="inset" 
                    bg="emerald" 
                    bgOpacity={20} 
                    rounded="full" 
                    className="blur-3xl animate-pulse" 
                />
                <Surface 
                    variant="tonal-zinc" 
                    padding={STORE_TOKENS.PADDING.CONTAINER} 
                    rounded="full" 
                    border="standard" 
                    borderColor="emerald"
                    borderOpacity={30}
                    style={{ boxShadow: '0 0 50px rgba(16,185,129,0.2)' }}
                >
                    <Box>
                        <Icon icon={CheckCircle} size="lg" color="emerald" />
                    </Box>
                </Surface>
            </Box>

            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                <Font variant="h2" weight="black" color="white" uppercase italic tracking="tight" align="center">
                    Missão de Hoje <Font variant="h2" color="success">Concluída!</Font> ✅
                </Font>
                <Font 
                    variant="sub-tiny" 
                    color="zinc-500" 
                    weight="black" 
                    uppercase 
                    tracking="widest" 
                    align="center"
                    style={{ maxWidth: '400px' }}
                >
                    Você já finalizou este treino hoje. Aproveite o descanso e volte amanhã para mais resultados!
                </Font>
            </Stack>

            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} width="full" style={{ maxWidth: '320px' }}>
                <Link href="/dashboard/student/workouts" passHref style={{ width: '100%' }}>
                    <Button variant="white" fullWidth height="12">
                        <Font variant="sub-tiny" weight="black" italic uppercase tracking="widest" color="black">
                            Voltar aos Treinos
                        </Font>
                    </Button>
                </Link>
                <Link href="/dashboard/student" passHref style={{ width: '100%' }}>
                    <Button variant="ghost" fullWidth height="12">
                        <Font variant="tiny" weight="bold" uppercase tracking="widest" color="zinc-500">
                            Ir para Dashboard
                        </Font>
                    </Button>
                </Link>
            </Stack>
        </Stack>
    )
}
