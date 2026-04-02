'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { Logo } from '@/components/ui/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, LogIn, Megaphone, Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import { loginAndActivateAffiliate } from '@/actions/affiliate-actions'

export default function AffiliadosLoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setStatus('Verificando credenciais...')

        // Single server round-trip: login + activate affiliate in DB atomically
        const result = await loginAndActivateAffiliate(email, password)

        if (result.error) {
            const msg = result.error.includes('Invalid login credentials')
                ? 'Email ou senha incorretos. Verifique e tente novamente.'
                : result.error
            setError(msg)
            setStatus(null)
            setLoading(false)
            return
        }

        // By the time we reach here, is_affiliate=true is already committed in DB
        setStatus('Redirecionando para o seu painel...')
        router.replace('/dashboard/affiliate')
    }

    return (
        <>
            <Script id="meta-pixel-affiliate-login" strategy="afterInteractive">
                {`
                    !function(f,b,e,v,n,t,s)
                    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                    n.queue=[];t=b.createElement(e);t.async=!0;
                    t.src=v;s=b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t,s)}(window, document,'script',
                    'https://connect.facebook.net/en_US/fbevents.js');
                    fbq('init', '795120573646319');
                    fbq('track', 'PageView');
                `}
            </Script>
            <noscript>
                <img height="1" width="1" style={{display: 'none'}} src="https://www.facebook.com/tr?id=795120573646319&ev=PageView&noscript=1" />
            </noscript>
            <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
            {/* Top bar */}
            <header className="h-16 flex items-center border-b border-zinc-900/50 ">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/afiliados">
                        <Logo size="md" />
                    </Link>
                    <Link
                        href="/afiliados/cadastro"
                        className="text-[10px] font-black text-zinc-500 hover:text-amber-400 uppercase tracking-widest transition-colors"
                    >
                        Criar conta nova
                    </Link>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center p-4 py-12">
                <div className="w-full max-w-md space-y-8">

                    {/* Back */}
                    <Link
                        href="/afiliados"
                        className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-[11px] font-bold uppercase tracking-widest transition-colors group"
                    >
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                        Voltar para o programa
                    </Link>

                    {/* Header */}
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1.5">
                            <Megaphone className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Área do Afiliado</span>
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">
                            Entrar no<br />
                            <span className="text-amber-400">Painel de Afiliado</span>
                        </h1>
                        {/* Key info for existing users */}
                        <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/15 rounded-xl p-3">
                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                <span className="text-amber-400 font-bold">Já tem conta de personal ou aluno?</span>{' '}
                                Sem problema — basta entrar aqui e o programa de afiliados é ativado automaticamente na sua conta existente.
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                                Email da sua conta RepTrail
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoFocus
                                disabled={loading}
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
                                    placeholder="Sua senha"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    disabled={loading}
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

                        {status && !error && (
                            <div className="flex items-center gap-2 text-amber-400/80 text-xs font-medium">
                                <div className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
                                {status}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase tracking-[0.1em] rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                    Aguarde...
                                </div>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" />
                                    Entrar no painel
                                </>
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-[11px] text-zinc-600">
                        Ainda não tem conta no RepTrail?{' '}
                        <Link href="/afiliados/cadastro" className="text-amber-500 hover:text-amber-400 font-bold transition-colors underline underline-offset-4">
                            Criar conta grátis
                        </Link>
                    </p>
                </div>
            </div>
        </>
    )
}
