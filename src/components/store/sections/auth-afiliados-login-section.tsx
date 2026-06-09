'use client'

import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { actions } from '@/lib/dal'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { AuthLoginForm } from '@/components/store/advanced/auth-login-form'

export function AuthAfiliadosLoginSection() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const result = await actions.loginAndActivateAffiliate(email, password)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        router.replace('/dashboard/affiliate')
    }

    return (
        <AuthShell>
            <Suspense fallback={null}>
                <AuthLoginForm 
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    onSubmit={handleSubmit}
                    loading={loading}
                    error={error}
                    color={STORE_TOKENS.COLORS.WARNING}
                    signupHref="/afiliados/cadastro"
                />
            </Suspense>
        </AuthShell>
    )
}
