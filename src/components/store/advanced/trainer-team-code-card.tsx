'use client'

import React from 'react'
import { Copy, Check, ShieldCheck } from 'lucide-react'
import { useToast } from '@/components/store/hooks/use-toast'
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
            title: 'CÃ³digo copiado!',
            description: 'Envie este cÃ³digo para seus alunos ou use o link do seu perfil pÃºblico.',
        })

        window.setTimeout(() => setCopied(false), 2000)
    }

    return (
        <GlassPanel padding={STORE_TOKENS.PADDING.NONE} rounded={STORE_TOKENS.RADIUS.SYSTEM} overflow="hidden" fullWidth>
            <Stack gap={STORE_TOKENS.SPACING.NONE} fullWidth>
                <Box padding={STORE_TOKENS.PADDING.CONTAINER} fullWidth>
                    <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            <Icon icon={ShieldCheck} color={STORE_TOKENS.COLORS.BRAND} size="sm" />
                            <Font
                                variant="body"
                                weight="black"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>
                                CÃ³digo da Equipe
                            </Font>
                        </Inline>

                        <Font
                            variant="description"
                            {...{
                                color: STORE_TOKENS.COLORS.TEXT.MUTED,
                            }}>
                            Seus alunos usarÃ£o este cÃ³digo no cadastro para se vincularem a vocÃª.
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
                                    {copied ? 'Copiado!' : 'Copiar CÃ³digo'}
                                </Font>
                            </Stack>
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </GlassPanel>
    );
}