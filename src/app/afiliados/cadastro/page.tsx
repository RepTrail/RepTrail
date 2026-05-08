'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Design System V2 Components
import { RegistryContext } from '@/components/store/advanced/registry-context'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Logo } from '@/components/store/base/logo'
import { Icon } from '@/components/store/base/icon'
import { AuthAffiliateSignUpForm } from '@/components/store/sections/auth-affiliate-signup-form'
import { AuthLoadingScreen } from '@/components/auth/auth-loading-screen'
import { Megaphone, CheckCircle2, ArrowLeft, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AffiliadosCadastroPage() {
    const router = useRouter()
    const supabase = createClient()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    function getAffiliateCookie(): string | null {
        if (typeof document === 'undefined') return null
        const match = document.cookie.match(/(?:^|;\s*)rt_affiliate_token=([^;]+)/)
        return match ? match[1] : null
    }

    async function getAffiliateIdFromToken(token: string): Promise<string | null> {
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

        if (!name.trim()) { setError('Informe seu nome.'); setLoading(false); return }
        if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres.'); setLoading(false); return }

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
                    role: 'student',
                    is_affiliate: true,
                    ...(referredById ? { referred_by_id: referredById } : {}),
                },
            },
        })

        if (signUpError) {
            setError(signUpError.message)
            setLoading(false)
            return
        }

        if (affiliateToken) {
            document.cookie = 'rt_affiliate_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
        }

        setSuccess(true)
        setLoading(false)
        setTimeout(() => router.push('/dashboard/affiliate'), 2000)
    }

    return (
        <RegistryContext.Provider value={{
            primaryColor: 'amber',
            activeTab: 'signup',
            setActiveTab: () => {},
            activeSection: 'auth',
            setActiveSection: () => {},
            isSidebarOpen: false,
            setIsSidebarOpen: () => {}
        }}>
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-5 relative overflow-hidden">
                {/* Dynamic Background Effects */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white_0%,transparent_90%)] opacity-[0.1]" />
                    <div className="absolute -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[120px] transition-colors duration-1000" />
                    <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[150px] transition-colors duration-1000" />
                </div>

                {(loading || success) && <AuthLoadingScreen />}

                <Stack gap={5} width="full" className="max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
                    {/* Back Link */}
                    <Link href="/afiliados">
                        <Stack direction="row" gap={2} align="center" className="text-zinc-500 hover:text-zinc-300 transition-colors group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                            <Font variant="sub-tiny" weight="black" uppercase tracking="widest">Voltar para o programa</Font>
                        </Stack>
                    </Link>

                    <Box display="flex" align="center" justify="center" className="mb-2">
                        <Link href="/">
                            <Logo size="md" color="amber" />
                        </Link>
                    </Box>

                    {/* Success State */}
                    {success ? (
                        <Surface variant="glass" padding={8} rounded="system" width="full" border="subtle">
                            <Stack gap={6} align="center" justify="center">
                                <Icon icon={CheckCircle2} size="lg" color="emerald" className="animate-bounce" />
                                <Stack gap={2} align="center">
                                    <Font variant="h2" align="center">Bem-vindo ao <Font variant="h2" color="amber">Time</Font></Font>
                                    <Font variant="description" align="center" color="zinc-400">
                                        Sua conta de afiliado foi criada com sucesso! Redirecionando...
                                    </Font>
                                </Stack>
                            </Stack>
                        </Surface>
                    ) : (
                        <>
                            {/* Benefits */}
                            <Box padding={3} rounded="system" className="bg-amber-500/5 border border-amber-500/15">
                                <Stack direction="row" gap={4} justify="center">
                                    {[
                                        { label: '10% Recorrente', icon: CheckCircle2 },
                                        { label: 'Link Único', icon: CheckCircle2 },
                                        { label: 'Painel Grátis', icon: CheckCircle2 }
                                    ].map(b => (
                                        <Stack key={b.label} direction="row" gap={1.5} align="center">
                                            <Icon icon={b.icon} size="tiny" color="emerald" />
                                            <Font variant="sub-tiny" weight="black" color="zinc-400" uppercase>{b.label}</Font>
                                        </Stack>
                                    ))}
                                </Stack>
                            </Box>

                            <AuthAffiliateSignUpForm 
                                fullName={name}
                                setFullName={setName}
                                email={email}
                                setEmail={setEmail}
                                password={password}
                                setPassword={setPassword}
                                onSignUp={handleSubmit}
                                loading={loading}
                                error={error}
                            />
                        </>
                    )}

                    <Box display="flex" align="center" justify="center" gap={2.5} className="text-zinc-600">
                        <ShieldCheck className="w-4 h-4" />
                        <Font variant="sub-tiny" weight="black" uppercase tracking="widest">Acesso Seguro & Criptografado</Font>
                    </Box>
                </Stack>
            </div>
        </RegistryContext.Provider>
    )
}
