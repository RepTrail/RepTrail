'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { loginAndActivateAffiliate } from '@/actions/affiliate-actions'

// Design System V2 Components
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { AuthShell } from '@/components/store/advanced/auth-shell'
import { AuthLoginForm } from '@/components/store/sections/auth-login-form'
import { AuthFormSkeleton } from '@/components/store/advanced/auth-form-skeleton'

export default function AffiliadosLoginPage() {
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const result = await loginAndActivateAffiliate(email, password)

        if (result.error) {
            setError(result.error)
            setLoading(false)
            return
        }

        router.replace('/dashboard/affiliate')
    }

    return (
        <RegistryProvider defaultColor="amber">
            <AuthShell>
                <Suspense fallback={<AuthFormSkeleton />}>
                    <AuthLoginForm 
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        color="amber"
                    />
                </Suspense>
            </AuthShell>
        </RegistryProvider>
    )
}
