'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { ShieldCheck, ArrowRight, Mail } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setMessage(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/update-password`,
            })
            if (error) throw error
            setMessage('Se existir uma conta com este email, você receberá um link para redefinir sua senha.')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col items-center text-center space-y-2">
                <Link href="/">
                    <Logo size="lg" className="mb-4" />
                </Link>
                <h1 className="text-2xl font-black text-white tracking-tight italic uppercase">
                    Recuperar Senha
                </h1>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
                    Digite seu email para receber o link
                </p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 shadow-2xl rounded-3xl overflow-hidden border-t-zinc-700/50">
                <CardContent className="p-8">
                    {message ? (
                        <div className="space-y-6 text-center">
                            <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                <Mail className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Email Enviado!</h3>
                                <p className="text-zinc-400 text-xs font-medium leading-relaxed">
                                    {message}
                                </p>
                            </div>
                            <Link href="/auth/login">
                                <Button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black uppercase tracking-widest rounded-xl h-12 mt-4">
                                    Voltar para Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <Alert className="bg-red-500/10 border-red-500/20 text-red-500 rounded-2xl">
                                    <AlertDescription className="text-xs font-bold uppercase tracking-wide">{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Cadastrado</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-12 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-[0.1em] rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                        Enviando...
                                    </div>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Enviar Link
                                        <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="bg-zinc-950/50 border-t border-zinc-800 p-6 flex justify-center">
                    <Link
                        href="/auth/login"
                        className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-emerald-500 transition-colors flex items-center gap-2"
                    >
                        Voltar para Login
                    </Link>
                </CardFooter>
            </Card>

            <div className="flex items-center justify-center gap-2 text-zinc-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Acesso Seguro & Criptografado</span>
            </div>
        </div>
    )
}
