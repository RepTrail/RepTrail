import { signOut } from '@/lib/dal/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    await signOut()
    
    return NextResponse.redirect(new URL('/auth/login?error=account_deleted', request.url))
}
