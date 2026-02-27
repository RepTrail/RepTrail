import { AuthForm } from '@/components/auth/auth-form'
import { Suspense } from 'react'
import { AuthFormSkeleton } from '@/components/auth/auth-form-skeleton'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4" suppressHydrationWarning>
            <Suspense fallback={<AuthFormSkeleton />}>
                <AuthForm view="login" />
            </Suspense>
        </div>
    )
}
