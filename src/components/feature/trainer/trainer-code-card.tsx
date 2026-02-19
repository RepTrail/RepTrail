'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Copy, ShieldCheck, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function TrainerCodeCard({ initialCode }: { initialCode: string | null }) {
    const [code] = useState(initialCode)
    const [copied, setCopied] = useState(false)
    const { toast } = useToast()

    const copyToClipboard = () => {
        if (!code) return
        navigator.clipboard.writeText(code)
        setCopied(true)
        toast({
            title: "Código copiado!",
            description: "Envie este código para seus alunos ou use o link de convite.",
        })
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Card className="bg-zinc-950 border-zinc-800 shadow-2xl rounded-2xl overflow-hidden border-t-zinc-700/50">
            <CardHeader className="bg-zinc-900/30 border-b border-zinc-900/50 py-4">
                <CardTitle className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Código da Equipe
                </CardTitle>
                <CardDescription className="text-[10px] text-zinc-500 font-medium uppercase tracking-tight leading-none mt-1">
                    Seus alunos usarão este código no cadastro para se vincularem a você.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div
                        onClick={copyToClipboard}
                        className="relative flex items-center justify-center p-6 bg-zinc-900/30 rounded-2xl border-2 border-dashed border-zinc-800 transition-all hover:bg-zinc-900/50 hover:border-zinc-700 cursor-pointer group"
                    >
                        <div className="text-2xl font-black text-white font-mono tracking-[0.3em] pl-[0.3em]">
                            {code || 'AGUARDE...'}
                        </div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy className="w-3 h-3 text-zinc-600" />
                        </div>
                    </div>

                    <Button
                        onClick={copyToClipboard}
                        className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 rounded-xl font-bold h-11 shadow-lg transition-all"
                    >
                        {copied ? (
                            <><Check className="w-4 h-4 mr-2" /> Copiado!</>
                        ) : (
                            <><Copy className="w-4 h-4 mr-2" /> Copiar Código</>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
