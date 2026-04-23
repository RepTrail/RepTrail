'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowRight, Loader2, Link } from 'lucide-react'

interface LeadCaptureModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    trainerName?: string
    trainerCode?: string
}

export function LeadCaptureModal({ isOpen, onOpenChange, trainerName, trainerCode }: LeadCaptureModalProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error: signUpError, data } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        whatsapp: whatsapp,
                        role: 'student',
                    },
                },
            })
            if (signUpError) throw signUpError

            // Guarantee the name is saved regardless of trigger behavior
            if (data?.user?.id) {
                await supabase
                    .from('profiles')
                    .update({ full_name: fullName, whatsapp: whatsapp })
                    .eq('id', data.user.id)
            }

            // Success state
            setSuccess(true)

            // Wait a moment for the user to see the success message
            setTimeout(() => {
                onOpenChange(false)
                if (trainerCode) {
                    router.push(`/personal/${trainerCode.toUpperCase().trim()}`)
                } else {
                    router.push('/dashboard/student')
                }
            }, 1500)

        } catch (err: any) {
            setError(err.message)
        } finally {
            if (!success) setLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                {!success ? (
                    <>
                        <DialogHeader className="space-y-4 text-center pb-4">
                            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter">
                                Crie sua conta Grátis
                            </DialogTitle>
                            <DialogDescription className="text-zinc-400 font-medium">
                                {trainerName
                                    ? `Para entrar em contato com ${trainerName}, você precisa de uma conta no RepTrail.`
                                    : 'Junte-se ao RepTrail para acessar os melhores treinadores.'}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert className="bg-red-500/10 border-red-500/20 text-red-500 rounded-xl py-2">
                                    <AlertDescription className="text-xs font-bold uppercase tracking-wide">{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-1.5">
                                <Label htmlFor="fullName" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Completo</Label>
                                <Input
                                    id="fullName"
                                    placeholder="Seu nome"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="bg-zinc-900 border-zinc-800 text-white rounded-xl h-11 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-zinc-900 border-zinc-800 text-white rounded-xl h-11 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="whatsapp" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">WhatsApp</Label>
                                <Input
                                    id="whatsapp"
                                    placeholder="(11) 99999-9999"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    required
                                    className="bg-zinc-900 border-zinc-800 text-white rounded-xl h-11 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" title="Senha" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-zinc-900 border-zinc-800 text-white rounded-xl h-11 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-[0.1em] rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    /* ❌ UI BLOCKING REMOVED */ disabled={false}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Criando...
                                        </div>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Criar Conta & Contatar
                                            <ArrowRight className="w-4 h-4" />
                                        </span>
                                    )}
                                </Button>
                            </div>
                        </form>

                        <DialogFooter className="sm:justify-center pt-2">
                            <p className="text-[10px] text-zinc-500 font-medium">
                                Já tem uma conta? <a href="/auth/login" className="text-emerald-500 hover:underline">Fazer Login</a>
                            </p>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center scale-110">
                            <ArrowRight className="w-10 h-10 text-zinc-950 -rotate-45" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Conta Criada!</h3>
                            <p className="text-zinc-400 font-medium">
                                Redirecionando você para {trainerName || 'o perfil'}...
                            </p>
                        </div>
                        <Loader2 className="w-6 h-6 text-emerald-500 animate-spin opacity-50" />
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
