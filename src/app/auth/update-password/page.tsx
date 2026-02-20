
import { UpdatePasswordForm } from '@/components/auth/update-password-form'
import { Suspense } from 'react'

export default function UpdatePasswordPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4">
            <Suspense fallback={<div className="text-zinc-500 text-sm">Carregando...</div>}>
                <UpdatePasswordForm />
            </Suspense>
        </div>
    )
}
