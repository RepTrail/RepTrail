import { TrendingUp } from 'lucide-react'
import { StudentMetricsChart } from '@/components/store/advanced/student-metrics-chart'
import { Button } from '@/components/store/base/button'
import Link from 'next/link'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface PerformanceAnalysisSectionProps {
    weights: { weight_kg: number; recorded_at: string }[]
    bfs: { bf_percentage: number; recorded_at: string }[]
    frequency: { week: string; date: string; sessions: number }[]
    trainerTier: string
    isStudentView?: boolean
}

export function PerformanceAnalysisSection({
    weights,
    bfs,
    frequency,
    trainerTier,
    isStudentView = false
}: PerformanceAnalysisSectionProps) {
    const isBlocked = trainerTier === 'start'

    if (isBlocked) {
        return (
            <Box bg={STORE_TOKENS.COLORS.BACKGROUND} bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} rounded={STORE_TOKENS.RADIUS.SYSTEM} border={true} borderColor={STORE_TOKENS.COLORS.BACKGROUND} borderOpacity={STORE_TOKENS.OPACITY.MEDIUM} padding={STORE_TOKENS.PADDING.SECTION}>
                <Stack align="center" justify="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Box bg={STORE_TOKENS.COLORS.BACKGROUND} padding={STORE_TOKENS.SPACING.CONTAINER} rounded={STORE_TOKENS.RADIUS.FULL} border={true} borderColor={STORE_TOKENS.COLORS.BACKGROUND} borderOpacity={STORE_TOKENS.OPACITY.MEDIUM} display="flex" align="center" justify="center">
                        <Icon icon={TrendingUp} size="xl" color={STORE_TOKENS.COLORS.TEXT.MUTED} />
                    </Box>
                    <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT} textAlign="center">
                        <Font
                            variant="h3"
                            weight="black"
                            italic
                            uppercase
                            {...{
                                color: "primary",
                            }}>Gráficos de Evolução</Font>
                        <Box maxWidth="sm">
                            <Font
                                variant="sub-tiny"
                                weight="black"
                                uppercase
                                {...{
                                    color: "zinc-500",
                                }}>
                                {isStudentView
                                    ? <>Esta função está disponível apenas para alunos de treinadores <Font
                                    weight="bold"
                                    {...{
                                        color: "emerald",
                                    }}>PRO e ELITE</Font>.</>
                                    : <>Esta função está disponível apenas para treinadores <Font
                                    weight="bold"
                                    {...{
                                        color: "emerald",
                                    }}>PRO e ELITE</Font>.</>
                                }
                            </Font>
                        </Box>
                    </Stack>
                    {!isStudentView && (
                        <Button asChild variant="emerald" size="lg" hoverScale={105} transition>
                            <Link href="/dashboard/trainer/profile">Fazer Upgrade Agora</Link>
                        </Button>
                    )}
                </Stack>
            </Box>
        );
    }

    return (
        <StudentMetricsChart
            weights={weights}
            bfs={bfs}
            frequency={frequency}
        />
    )
}
