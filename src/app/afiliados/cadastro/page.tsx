'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowRight, Megaphone, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react'

function getAffiliateCookie(): string | null {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(/(?:^|;\s*)rt_affiliate_token=([^;]+)/)
    return match ? match[1] : null
}

async function getAffiliateIdFromToken(token: string): Promise<string | null> {
    const supabase = createClient()
    const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('affiliate_token', token)
        .single()
    return data?.id ?? null
}

export default function AffiliadosCadastroPage() {
    const router = useRouter()
    const supabase = createClient()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!name.trim()) { setError('Informe seu nome.'); setLoading(false); return }
        if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); setLoading(false); return }

        // Check for referral cookie
        const affiliateToken = getAffiliateCookie()
        let referredById: string | null = null
        if (affiliateToken) {
            referredById = await getAffiliateIdFromToken(affiliateToken)
        }

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name.trim(),
                    role: 'student',       // default role; can be upgraded later
                    is_affiliate: true,    // the key flag
                    ...(referredById ? { referred_by_id: referredById } : {}),
                },
            },
        })

        if (signUpError) {
            if (signUpError.message.includes('already registered')) {
                setError('Este email já está cadastrado. Faça login.')
            } else {
                setError(signUpError.message)
            }
            setLoading(false)
            return
        }

        // Clear referral cookie
        if (affiliateToken) {
            document.cookie = 'rt_affiliate_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
        }

        setSuccess(true)
        setLoading(false)

        // Small delay then redirect
        setTimeout(() => router.push('/dashboard/affiliate'), 2000)
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
            {/* Top bar */}
            <header className="h-16 flex items-center border-b border-zinc-900/50 ">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/afiliados">
                        <Logo size="md" />
                    </Link>
                    <Link href="/afiliados/login" className="text-[10px] font-black text-zinc-500 hover:text-amber-400 uppercase tracking-widest transition-colors">
                        Já tenho conta
                    </Link>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="w-full max-w-md space-y-8">

                    {/* Back link */}
                    <Link href="/afiliados" className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-[11px] font-bold uppercase tracking-widest transition-colors group">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Voltar para a página do programa
                    </Link>

                    {/* Header */}
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1.5">
                            <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Cadastro de Afiliado</span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">
                            Crie sua conta<br />
                            <span className="text-amber-400">em menos de 1 minuto</span>
                        </h1>
                        <p className="text-zinc-400 text-sm">
                            Só precisamos do básico. Você já começa a ganhar hoje.
                        </p>
                    </div>

                    {/* Benefícios rápidos */}
                    <div className="flex gap-4">
                        {['10% recorrente', 'Link exclusivo', 'Dashboard grátis'].map(b => (
                            <div key={b} className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">{b}</span>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    {success ? (
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-black text-white">Bem-vindo ao programa! 🎉</h2>
                            <p className="text-zinc-400 text-sm">
                                Sua conta foi criada. Redirecionando para o seu painel de afiliado...
                            </p>
                            <div className="flex justify-center">
                                <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                    Seu nome
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Como te chamamos?"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                    className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-12 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-12 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                    Senha
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Mínimo 6 caracteres"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                        className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-12 focus:ring-amber-500/20 focus:border-amber-500 transition-all pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1"
                                    >
                                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                    <p className="text-red-400 text-xs font-bold">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                /* ❌ UI BLOCKING REMOVED */ disabled={false}
                                className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase tracking-[0.1em] rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                        Criando sua conta...
                                    </div>
                                ) : (
                                    <>
                                        <span className="md:hidden">Criar Conta</span>
                                        <span className="hidden md:inline">Criar minha conta de afiliado</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </Button>

                            <p className="text-center text-[10px] text-zinc-600 font-medium">
                                Ao se cadastrar você concorda com os{' '}
                                <Link href="/" className="text-zinc-500 hover:text-zinc-400 underline underline-offset-2">termos de uso</Link>.
                            </p>
                        </form>
                    )}

                    <p className="text-center text-[11px] text-zinc-600">
                        Já é afiliado?{' '}
                        <Link href="/afiliados/login" className="text-amber-500 hover:text-amber-400 font-bold transition-colors underline underline-offset-4">
                            Fazer login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
