'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Link from 'next/link'
import { ShieldCheck, ArrowRight, User, Users, Megaphone } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface AuthFormProps {
    view: 'login' | 'signup'
}

export function AuthForm({ view }: AuthFormProps) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [role, setRole] = useState<'trainer' | 'student'>('student')
    const [isAffiliate, setIsAffiliate] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    useEffect(() => {
        if (view === 'signup' && searchParams.get('affiliate') === 'true') {
            setIsAffiliate(true)
        }
    }, [view, searchParams])

    const getAffiliateCookie = () => {
        const match = document.cookie.match(/rt_affiliate_token=([^;]+)/)
        return match ? match[1] : null
    }

    const getAffiliateIdFromToken = async (token: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('id')
            .eq('affiliate_token', token)
            .single()
        return data?.id ?? null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (view === 'signup') {
                // Read referral cookie
                const affiliateToken = getAffiliateCookie()
                let referredById: string | null = null
                if (affiliateToken) {
                    referredById = await getAffiliateIdFromToken(affiliateToken)
                }

                const { error, data: signUpData } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            whatsapp: whatsapp,
                            role: role,
                            is_affiliate: isAffiliate,
                            ...(referredById ? { referred_by_id: referredById } : {}),
                        },
                    },
                })
                if (error) throw error

                // Guarantee the profile has the name saved — some environments have
                // trigger constraints that silently drop the name. This upsert ensures it.
                if (signUpData?.user?.id) {
                    await supabase
                        .from('profiles')
                        .update({ full_name: fullName, whatsapp: whatsapp })
                        .eq('id', signUpData.user.id)
                }

                // Clear affiliate cookie after successful registration
                if (affiliateToken) {
                    document.cookie = 'rt_affiliate_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
                }

                alert('Cadastro realizado! Verifique seu email ou faça login.')
                router.push('/auth/login')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error

                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role, is_affiliate')
                        .eq('id', user.id)
                        .single()

                    if (profile?.role === 'trainer') {
                        router.push('/dashboard/trainer')
                    } else {
                        router.push('/dashboard/student')
                    }
                }
            }
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
                    {view === 'login' ? 'Bem-vindo de volta' : 'Comece sua jornada'}
                </h1>
                <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest">
                    {view === 'login' ? 'Acesse sua conta para treinar' : 'Crie sua conta em segundos'}
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
                            <Label htmlFor="email" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Profissional</Label>
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

                        <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                                <Label htmlFor="password" title="Senha" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Senha de Acesso</Label>
                                {view === 'login' && (
                                    <Link href="/auth/forgot-password" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:text-emerald-400">
                                        Esqueci a senha
                                    </Link>
                                )}
                            </div>
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

                        {view === 'signup' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="fullName" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Completo</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="Como devemos te chamar?"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                        className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-12 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">WhatsApp</Label>
                                    <Input
                                        id="whatsapp"
                                        placeholder="Ex: 11 99999-9999"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        required
                                        className="bg-zinc-950 border-zinc-800 text-white rounded-xl h-12 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Tipo de Perfil</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setRole('student')}
                                            className={`flex items-center justify-center gap-2 h-12 rounded-xl border transition-all font-bold text-xs uppercase tracking-widest ${role === 'student' ? 'bg-emerald-500 border-emerald-500 text-zinc-950' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                                        >
                                            <User className="w-4 h-4" /> Aluno
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole('trainer')}
                                            className={`flex items-center justify-center gap-2 h-12 rounded-xl border transition-all font-bold text-xs uppercase tracking-widest ${role === 'trainer' ? 'bg-emerald-500 border-emerald-500 text-zinc-950' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                                        >
                                            <Users className="w-4 h-4" /> Personal
                                        </button>
                                    </div>
                                </div>

                                {/* Affiliate option */}
                                <button
                                    type="button"
                                    onClick={() => setIsAffiliate(!isAffiliate)}
                                    className={`w-full flex items-center justify-between h-12 rounded-xl border px-4 transition-all ${isAffiliate ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                                >
                                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                        <Megaphone className="w-4 h-4" />
                                        Quero ser afiliado
                                    </span>
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isAffiliate ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>
                                        {isAffiliate ? 'Ativo' : 'Opcional'}
                                    </span>
                                </button>
                                {isAffiliate && (
                                    <p className="text-[10px] text-amber-500/70 text-center font-medium px-2">
                                        Ganhe 10% de comissão por cada personal que você indicar 🚀
                                    </p>
                                )}
                            </>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-black uppercase tracking-[0.1em] rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                                    Processando...
                                </div>
                            ) : (
                                <span className="flex items-center gap-2">
                                    {view === 'login' ? 'Entrar Agora' : 'Criar minha conta'}
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="bg-zinc-950/50 border-t border-zinc-800 p-6 flex justify-center">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {view === 'login' ? 'Ainda não é membro? ' : 'Já possui uma conta? '}
                        <Link
                            href={view === 'login' ? '/auth/signup' : '/auth/login'}
                            className="text-emerald-500 hover:text-emerald-400 transition-colors underline underline-offset-4"
                        >
                            {view === 'login' ? 'Cadastre-se grátis' : 'Fazer login'}
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
