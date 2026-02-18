'use client'

import { useEffect, useState } from 'react'
import { getTermsStatus, acceptTerms } from '@/actions/terms-actions'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Loader2 } from 'lucide-react'

const TERMS_TEXT = `
Ao utilizar a plataforma RepTrail, você concorda com os seguintes termos de uso:

1. **Uso da Plataforma**: A plataforma é destinada à conexão entre personal trainers e alunos para acompanhamento de treinos, dietas e evolução física.

2. **Privacidade**: Seus dados pessoais são tratados conforme nossa política de privacidade e utilizados apenas para os fins do serviço.

3. **Divulgação de Imagens**: O RepTrail permite que personal trainers divulguem fotos de progresso dos alunos em seus perfis públicos, como forma de demonstrar resultados e transformações. Ao marcar a opção abaixo, você autoriza que suas fotos de evolução (quando definidas como públicas) possam ser exibidas no perfil público do seu personal trainer.

4. **Responsabilidade**: O conteúdo compartilhado é de responsabilidade de quem o publica. Mantenha um ambiente respeitoso e profissional.

Ao prosseguir, você confirma que leu, compreendeu e aceita estes termos.
`.trim()

export function TermsAcceptanceModal() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [accepting, setAccepting] = useState(false)
    const [allowImageDisclosure, setAllowImageDisclosure] = useState(true)

    useEffect(() => {
        getTermsStatus().then((status) => {
            setLoading(false)
            if (status && !status.accepted) {
                setAllowImageDisclosure(status.allowImageDisclosure ?? true)
                setOpen(true)
            }
        })
    }, [])

    const handleAccept = async () => {
        setAccepting(true)
        const result = await acceptTerms(allowImageDisclosure)
        setAccepting(false)
        if (result.success) {
            setOpen(false)
        }
    }

    if (loading) return null

    return (
        <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent
                className="max-w-lg bg-zinc-900 border-zinc-800 text-white"
                showCloseButton={false}
                onPointerDownOutside={(e) => e.preventDefault()}
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-white uppercase tracking-tight">
                        Termos de Uso
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400 text-left leading-relaxed">
                        Para continuar usando o RepTrail, leia e aceite os termos abaixo:
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[40vh] overflow-y-auto rounded-xl bg-zinc-950/50 border border-zinc-800 p-4 text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed [&>strong]:text-white">
                    {TERMS_TEXT}
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-zinc-950/30 border border-zinc-800 p-4">
                    <Checkbox
                        id="allow-images"
                        checked={allowImageDisclosure}
                        onCheckedChange={(v) => setAllowImageDisclosure(v === true)}
                        className="border-zinc-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                    <label
                        htmlFor="allow-images"
                        className="text-sm text-zinc-300 cursor-pointer leading-snug"
                    >
                        Autorizo a divulgação das minhas fotos de progresso no perfil público do meu personal trainer (quando definidas como públicas).
                    </label>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        onClick={handleAccept}
                        disabled={accepting}
                        className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase"
                    >
                        {accepting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            'Aceitar e continuar'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
