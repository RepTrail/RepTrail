'use client'

import React from 'react'
import { Copy, Check, ShieldCheck } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { GlassPanel } from '@/components/store/base/surface'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { Inline } from '@/components/store/base/layout'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { TeamCodeTicket } from '@/components/store/intermediary/team-code-ticket'

interface TrainerTeamCodeCardProps {
    trainerCode?: string | null
}

export function TrainerTeamCodeCard({ trainerCode }: TrainerTeamCodeCardProps) {
    const { toast } = useToast()
    const [copied, setCopied] = React.useState(false)
    const resolvedCode = trainerCode?.trim().toUpperCase() || null

    const handleCopy = async () => {
        if (!resolvedCode) return

        await navigator.clipboard.writeText(resolvedCode)
        setCopied(true)

        toast({
            title: 'Código copiado!',
            description: 'Envie este código para seus alunos ou use o link do seu perfil público.',
        })

        window.setTimeout(() => setCopied(false), 2000)
    }

    return (
        <GlassPanel padding="none" rounded={STORE_TOKENS.RADIUS.SYSTEM} overflow="hidden" fullWidth>
            <Stack gap="none" fullWidth>
                <Box padding={STORE_TOKENS.PADDING.CONTAINER} fullWidth>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={ShieldCheck} color="primary" size="sm" />
                            <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black">
                                Código da Equipe
                            </Font>
                        </Inline>

                        <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                            Seus alunos usarão este código no cadastro para se vincularem a você.
                        </Font>
                    </Stack>
                </Box>

                <Box width="full" height="px" bg={STORE_TOKENS.COLORS.WHITE} bgOpacity={STORE_TOKENS.OPACITY.LOW} />

                <Box padding={STORE_TOKENS.PADDING.CONTAINER} fullWidth>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                        <TeamCodeTicket code={resolvedCode} />

                        <Button
                            variant="outline-emerald"
                            size="lg"
                            rounded={STORE_TOKENS.RADIUS.FULL}
                            fullWidth
                            onClick={handleCopy}
                            disabled={!resolvedCode}
                        >
                            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Icon icon={copied ? Check : Copy} size="sm" />
                                <Font {...STORE_TOKENS.TYPOGRAPHY.LABEL}>
                                    {copied ? 'Copiado!' : 'Copiar Código'}
                                </Font>
                            </Stack>
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </GlassPanel>
    )
}