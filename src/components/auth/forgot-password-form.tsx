'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck } from 'lucide-react'
import { Logo } from '@/components/store/base/logo'
import { AuthLoadingScreen } from './auth-loading-screen'
import { AuthForgotPasswordForm } from '@/components/store/sections/auth-forgot-password-form'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { RegistryContext } from '@/components/store/advanced/registry-context'
import { cn } from '@/lib/utils'

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
        <RegistryContext.Provider value={{
            primaryColor: 'orange', // Forgot password usually follows student/default branding
            activeTab: 'forgot-password',
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
                    <div className="absolute -top-[10%] -right-[5%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-orange-500/10 to-transparent blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-orange-500/5 blur-[150px] pointer-events-none" />
                </div>

                {loading && <AuthLoadingScreen />}
                
                <Box display="flex" align="center" justify="center" className="mb-5">
                    <Link href="/">
                        <Logo size="md" color="orange" />
                    </Link>
                </Box>

                <AuthForgotPasswordForm 
                    email={email}
                    setEmail={setEmail}
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    message={message}
                />

                <Box display="flex" align="center" justify="center" gap={2.5} className="text-zinc-600">
                    <ShieldCheck className="w-4 h-4" />
                    <Font variant="sub-tiny" weight="black" uppercase tracking="widest">Acesso Seguro & Criptografado</Font>
                </Box>
            </Stack>
        </RegistryContext.Provider>
    )
}
