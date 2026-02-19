import { AuthForm } from '@/components/auth/auth-form'
import { Suspense } from 'react'

export default function SignupPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4">
            <Suspense fallback={<div className="text-zinc-500 text-sm">Carregando...</div>}>
                <AuthForm view="signup" />
            </Suspense>
        </div>
    )
}
