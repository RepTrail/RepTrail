'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link, Copy, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

import { cn } from '@/lib/utils'

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
        <Button
            onClick={copyLink}
            variant="outline"
            className={cn("border-orange-500/20 bg-orange-500/10 text-orange-500 hover:bg-orange-500/30 hover:border-orange-500/50 hover:text-orange-400 rounded-xl font-bold h-11 px-6 gap-2 transition-all duration-200", className)}
        >
            {copied ? (
                <><Check className="w-4 h-4" /> Link Copiado</>
            ) : (
                <><Link className="w-4 h-4" /> Copiar Link de Convite</>
            )}
        </Button>
    )
}
