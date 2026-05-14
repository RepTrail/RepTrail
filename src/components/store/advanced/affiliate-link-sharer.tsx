'use client'

import { useState, useEffect } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { GlassPanel } from '@/components/store/base/surface'
import { Link as LinkIcon, Copy, Check } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface AffiliateLinkSharerProps {
    token: string | null
}

/**
 * AffiliateLinkSharer: An advanced component to manage and share affiliate links.
 * Extracts complex sharing UI from sections.
 */
export function AffiliateLinkSharer({ token }: AffiliateLinkSharerProps) {
    const [copied, setCopied] = useState(false)
    const [affiliateLink, setAffiliateLink] = useState<string | null>(null)

    useEffect(() => {
        if (token && typeof window !== 'undefined') {
            setAffiliateLink(`${window.location.origin}/?ref=${token}`)
        }
    }, [token])

    const handleCopy = async () => {
        if (!affiliateLink) return
        await navigator.clipboard.writeText(affiliateLink)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM}>
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                        Seu Link de Afiliado
                    </Font>
                    <Stack direction="row" gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                        <GlassPanel padding={STORE_TOKENS.PADDING.CONTAINER} flex1 rounded={STORE_TOKENS.RADIUS.SYSTEM}>
                            <Stack direction="row" gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                                <Icon icon={LinkIcon} color={STORE_TOKENS.COLORS.BRAND} size="xs" />
                                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.BRAND} weight="bold" mono truncate>
                                    {affiliateLink || 'Gerando link...'}
                                </Font>
                            </Stack>
                        </GlassPanel>
                        
                        <Button 
                            variant={copied ? 'primary' : 'outline-primary'} 
                            rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                            padding={STORE_TOKENS.PADDING.CONTAINER} 
                            onClick={handleCopy}
                        >
                            <Icon icon={copied ? Check : Copy} size="xs" />
                        </Button>

                        <Stack gap={0} align="center">
                            <Font variant="heading" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="black">10%</Font>
                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase italic tracking="widest">De Comissão</Font>
                        </Stack>
                    </Stack>
                </Stack>

                <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM} italic>
                    Cookie persistido por 30 dias • Token oculto ao usuário • Conversões automáticas
                </Font>
            </Stack>
        </GlassPanel>
    )
}
