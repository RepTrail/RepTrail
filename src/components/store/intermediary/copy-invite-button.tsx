'use client'

import React from 'react'
import { Copy, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Font } from '@/components/store/base/font'
import { Stack } from '@/components/store/base/stack'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface CopyInviteButtonProps {
    trainerCode?: string | null
    fullWidth?: boolean | { base: boolean, sm?: boolean, md?: boolean, lg?: boolean }
}

/**
 * CopyInviteButton: An intermediary component that copies the trainer's public profile/invite link to the clipboard.
 * Fully compliant with the RepTrail Design System Rules.
 */
export function CopyInviteButton({ trainerCode, fullWidth = { base: true, sm: false } }: CopyInviteButtonProps) {
    const { toast } = useToast()
    const [copied, setCopied] = React.useState(false)

    const handleCopy = async () => {
        if (!trainerCode) return

        const inviteLink = `${window.location.origin}/personal/${trainerCode.toUpperCase().trim()}`

        await navigator.clipboard.writeText(inviteLink)
        setCopied(true)

        toast({
            title: 'Link copiado!',
            description: 'Envie este link para seus alunos se vincularem a você.',
        })

        window.setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button
            variant={copied ? "outline-emerald" : "outline-orange"}
            size="md"
            shine
            rounded={STORE_TOKENS.RADIUS.SYSTEM}
            fullWidth={fullWidth}
            onClick={handleCopy}
            disabled={!trainerCode}
        >
            <Stack direction="row" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                <Icon icon={copied ? Check : Copy} size="xs" />
                {copied ? 'Copiado!' : 'Copiar Convite'}
            </Stack>
        </Button>
    );
}
