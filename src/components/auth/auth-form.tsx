'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, FileText } from 'lucide-react'
import { Logo } from '@/components/store/base/logo'
import { Modal } from '@/components/store/advanced/modal'
import { AuthLoadingScreen } from './auth-loading-screen'
import { fbqEvent } from '@/lib/meta-pixel'
import { TRAINER_TERMS, STUDENT_TERMS } from '@/lib/terms-content'
import { cn } from '@/lib/utils'

// New Design System V2 Components
import { AuthLoginForm } from '@/components/store/sections/auth-login-form'
import { AuthSignUpForm } from '@/components/store/sections/auth-signup-form'
import { AuthAffiliateSignUpForm } from '@/components/store/sections/auth-affiliate-signup-form'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { RegistryContext, RegistryColor } from '@/components/store/advanced/registry-context'

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
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [acceptedTerms, setAcceptedTerms] = useState(true)
    const [showTermsDialog, setShowTermsDialog] = useState(false)
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

        if (view === 'signup' && !acceptedTerms) {
            setError('Você precisa aceitar os termos de uso para continuar.')
            return
        }

        setLoading(true)
        setError(null)
        let isRedirecting = false

        try {
            if (view === 'signup') {
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
                            ...(searchParams.get('code') ? { trainer_code: searchParams.get('code') } : {}),
                        },
                    },
                })
                if (error) throw error

                if (signUpData?.user?.id) {
                    const { data: placeholder } = await supabase
                        .from('profiles')
                        .select('id, is_placeholder')
                        .eq('email', email)
                        .eq('is_placeholder', true)
                        .maybeSingle()

                    const profileData = {
                        id: signUpData.user.id,
                        email: email,
                        full_name: fullName,
                        whatsapp: whatsapp,
                        role: role,
                        is_placeholder: false,
                        terms_accepted_at: new Date().toISOString(),
                        saw_auto_training_onboarding_modal: true,
                        ...(role === 'student' ? {
                            auto_training_status: 'trial',
                            auto_training_trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        } : {
                            plan_tier: 'on_demand'
                        }),
                    }

                    if (placeholder) {
                        const { error: mergeError } = await supabase.rpc('merge_ghost_data', {
                            new_user_id: signUpData.user.id,
                            user_email: email
                        })
                        if (mergeError) console.error('[AUTH] RPC Merge Error:', mergeError)
                        await supabase.from('profiles').upsert(profileData, { onConflict: 'id' })
                    } else {
                        await supabase.from('profiles').upsert(profileData, { onConflict: 'id' })
                    }
                }

                if (affiliateToken) {
                    document.cookie = 'rt_affiliate_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;'
                }

                fbqEvent("CompleteRegistration", { content_name: role, status: "success" });
                if (role === 'student') fbqEvent("StartTrial", { predicted_ltv: 0 });

                router.push(role === 'trainer' ? '/dashboard/trainer' : '/dashboard/student')
                isRedirecting = true
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error

                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single()

                    const effectiveRole = profile?.role || user.user_metadata?.role

                    if (!profile?.role && user.user_metadata?.role) {
                        await supabase.from('profiles').update({ role: user.user_metadata.role }).eq('id', user.id)
                    }

                    router.push(effectiveRole === 'trainer' ? '/dashboard/trainer' : '/dashboard/student')
                    isRedirecting = true
                }
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            if (!isRedirecting) setLoading(false)
        }
    }

    // Determine primary color based on context
    const getPrimaryColor = (): RegistryColor => {
        if (isAffiliate) return 'amber'
        if (role === 'trainer') return 'emerald'
        return 'orange'
    }

    const primaryColor = getPrimaryColor()

    return (
        <RegistryContext.Provider value={{
            primaryColor,
            activeTab: view,
            setActiveTab: () => {},
            activeSection: 'auth',
            setActiveSection: () => {},
            isSidebarOpen: false,
            setIsSidebarOpen: () => {}
        }}>
            <Stack gap={5} width="full" className="max-w-[440px] animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10">
                {/* Dynamic Background Effects */}
                <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(to_bottom,white_0%,transparent_90%)] opacity-[0.1]" />
                    <div className={cn(
                        "absolute -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full blur-[120px] transition-colors duration-1000",
                        primaryColor === 'emerald' && "bg-emerald-500/10",
                        primaryColor === 'orange' && "bg-orange-500/10",
                        primaryColor === 'amber' && "bg-amber-500/10",
                        primaryColor === 'blue' && "bg-blue-500/10",
                        primaryColor === 'red' && "bg-red-500/10"
                    )} />
                    <div className={cn(
                        "absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full blur-[150px] transition-colors duration-1000",
                        primaryColor === 'emerald' && "bg-emerald-500/5",
                        primaryColor === 'orange' && "bg-orange-500/5",
                        primaryColor === 'amber' && "bg-amber-500/5",
                        primaryColor === 'blue' && "bg-blue-500/5",
                        primaryColor === 'red' && "bg-red-500/5"
                    )} />
                </div>

                {loading && <AuthLoadingScreen />}
                
                <Box display="flex" align="center" justify="center" className="mb-5">
                    <Link href="/">
                        <Logo size="md" color={primaryColor as any} />
                    </Link>
                </Box>

                {view === 'login' ? (
                    <AuthLoginForm 
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                    />
                ) : (
                    isAffiliate ? (
                        <AuthAffiliateSignUpForm 
                            loading={loading}
                            error={error}
                            onSignUp={handleSubmit}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            fullName={fullName}
                            setFullName={setFullName}
                            whatsapp={whatsapp}
                            setWhatsapp={setWhatsapp}
                        />
                    ) : (
                        <AuthSignUpForm 
                            fullName={fullName}
                            setFullName={setFullName}
                            email={email}
                            setEmail={setEmail}
                            whatsapp={whatsapp}
                            setWhatsapp={setWhatsapp}
                            password={password}
                            setPassword={setPassword}
                            role={role}
                            setRole={setRole as any}
                            acceptedTerms={acceptedTerms}
                            setAcceptedTerms={setAcceptedTerms}
                            onShowTerms={() => setShowTermsDialog(true)}
                            onSubmit={handleSubmit}
                            loading={loading}
                            error={error}
                        />
                    )
                )}

                <Box display="flex" align="center" justify="center" gap={2.5} className="text-zinc-600">
                    <ShieldCheck className="w-4 h-4" />
                    <Font variant="sub-tiny" weight="black" uppercase tracking="widest">Acesso Seguro & Criptografado</Font>
                </Box>

                <Modal 
                    isOpen={showTermsDialog} 
                    onClose={() => setShowTermsDialog(false)}
                    title={`Termos de Uso - ${role === 'trainer' ? 'Personal' : 'Aluno'}`}
                    subtitle="Leia atentamente os termos da plataforma RepTrail."
                    icon={FileText}
                    variant={primaryColor as any}
                    confirmLabel="Entendi"
                    cancelLabel="Fechar"
                >
                    <div className="max-h-[50vh] overflow-y-auto rounded-xl bg-zinc-950 border border-zinc-900 p-6 text-[13px] text-zinc-400 whitespace-pre-wrap leading-relaxed [&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-3 [&>h3]:font-black [&>h3]:uppercase [&>h3]:tracking-widest [&>strong]:text-white">
                        {role === 'trainer' ? TRAINER_TERMS : STUDENT_TERMS}
                    </div>
                </Modal>
            </Stack>
        </RegistryContext.Provider>
    )
}
