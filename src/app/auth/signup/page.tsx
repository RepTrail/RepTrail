import { AuthForm } from '@/components/auth/auth-form'

export default function SignupPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4">
            <AuthForm view="signup" />
        </div>
    )
}
