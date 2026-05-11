'use client'

import { useState, useEffect } from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { GlassPanel } from '@/components/store/base/surface'
import { Link as LinkIcon, Copy, Check } from 'lucide-react'

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
        <GlassPanel padding={5} rounded="system">
            <Stack gap={5}>
                <Stack gap={2.5}>
                    <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase tracking="widest">
                        Seu Link de Afiliado
                    </Font>
                    <Stack direction="row" gap={5} align="center">
                        <GlassPanel padding={5} flex1 rounded="system">
                            <Stack direction="row" gap={2.5} align="center">
                                <Icon icon={LinkIcon} color="primary" size="xs" />
                                <Font variant="sub-tiny" color="primary" weight="bold" mono truncate>
                                    {affiliateLink || 'Gerando link...'}
                                </Font>
                            </Stack>
                        </GlassPanel>
                        
                        <Button 
                            variant={copied ? 'primary' : 'outline-primary'} 
                            rounded="system" 
                            padding={5} 
                            onClick={handleCopy}
                        >
                            <Icon icon={copied ? Check : Copy} size="xs" />
                        </Button>

                        <Stack gap={0} align="center">
                            <Font variant="heading" color="white" weight="black">10%</Font>
                            <Font variant="sub-tiny" color="zinc-500" weight="black" uppercase italic tracking="widest">De Comissão</Font>
                        </Stack>
                    </Stack>
                </Stack>

                <Font variant="sub-tiny" color="zinc-600" italic>
                    Cookie persistido por 30 dias • Token oculto ao usuário • Conversões automáticas
                </Font>
            </Stack>
        </GlassPanel>
    )
}
