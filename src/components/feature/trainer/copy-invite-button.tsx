'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Link, Copy, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function CopyInviteButton({ trainerCode }: { trainerCode: string }) {
    const [copied, setCopied] = useState(false)
    const { toast } = useToast()

    const copyLink = () => {
        const inviteLink = `${window.location.origin}/register?code=${trainerCode}`
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
            className="border-orange-500/20 bg-orange-500/10 text-orange-500 hover:bg-orange-500/30 hover:border-orange-500/50 hover:text-orange-400 rounded-xl font-bold h-11 px-6 gap-2 transition-all duration-200"
        >
            {copied ? (
                <><Check className="w-4 h-4" /> Link Copiado</>
            ) : (
                <><Link className="w-4 h-4" /> Copiar Link de Convite</>
            )}
        </Button>
    )
}
