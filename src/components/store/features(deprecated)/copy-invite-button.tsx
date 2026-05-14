'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link, Copy, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

import { cn } from '@/lib/utils'

import { PillButton } from '@/components/ui/pill-button'

export function CopyInviteButton({ trainerCode, className }: { trainerCode: string, className?: string }) {
    const [copied, setCopied] = useState(false)
    const { toast } = useToast()

    const copyLink = () => {
        const inviteLink = `${window.location.origin}/auth/signup?code=${trainerCode}`
        navigator.clipboard.writeText(inviteLink)
        setCopied(true)
        toast({
            title: "Link de convite copiado!",
            description: "Envie este link para seus novos alunos.",
        })
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <PillButton
            onClick={copyLink}
            variant="orange"
            className={cn("w-full sm:w-auto", className)}
        >
            {copied ? (
                <><Check className="w-4 h-4" /> Link Copiado</>
            ) : (
                <><Link className="w-4 h-4" /> Copiar Link de Convite</>
            )}
        </PillButton>
    )
}
