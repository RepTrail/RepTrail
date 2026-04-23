'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { ShieldCheck, ArrowRight, Lock, CheckCircle } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export function UpdatePasswordForm() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    // O Supabase lida com o token da URL automaticamente via sessão
    // Mas devemos garantir que estamos autenticados antes de atualizar?
    // Quando o usuario clica no link, o Supabase seta a sessao.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.')
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setError('A senha deve ter no mínimo 6 caracteres.')
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.updateUser({ password: password })
            if (error) throw error

            setSuccess(true)
            // Redireciona após 3 segundos
            setTimeout(() => {
                router.push('/auth/login')
            }, 3000)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="flex flex-col items-center text-center space-y-2">
                    <Logo size="lg" className="mb-4" />
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-4 animate-bounce">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight italic uppercase">
                        Senha Atualizada!
                    </h1>
                    <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
                        Sua senha foi redefinida com sucesso.
                    </p>
                    <p className="text-zinc-600 text-xs mt-4">Redirecionando para login...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="flex flex-col items-center text-center space-y-2">
                <Link href="/">
                    <Logo size="lg" className="mb-4" />
                </Link>
                <h1 className="text-2xl font-black text-white tracking-tight italic uppercase">
                    Nova Senha
                </h1>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
                    Defina sua nova senha de acesso
                </p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 shadow-2xl rounded-3xl overflow-hidden border-t-zinc-700/50">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <Alert className="bg-red-500/10 border-red-500/20 text-red-500 rounded-2xl">
                                <AlertDescription className="text-xs font-bold uppercase tracking-wide">{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="password" title="Nova Senha" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nova Senha</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-12 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword" title="Confirmar Senha" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Confirmar Senha</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-12 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-[0.1em] rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                            /* ❌ UI BLOCKING REMOVED */ disabled={false}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                    Atualizando...
                                </div>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Confirmar Nova Senha
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="bg-zinc-950/50 border-t border-zinc-800 p-6 flex justify-center">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Lembrou a senha?
                        <Link
                            href="/auth/login"
                            className="text-emerald-500 hover:text-emerald-400 transition-colors underline underline-offset-4 ml-1"
                        >
                            Fazer login
                        </Link>
                    </p>
                </CardFooter>
            </Card>

            <div className="flex items-center justify-center gap-2 text-zinc-600">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Acesso Seguro & Criptografado</span>
            </div>
        </div>
    )
}
