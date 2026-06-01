
import { signOut } from '@/lib/dal/server'
import { redirect } from 'next/navigation'

export async function GET() {
    await signOut()
    return redirect('/auth/login')
}

export async function POST(request: Request) {
    await signOut()
    return redirect('/auth/login')
}

