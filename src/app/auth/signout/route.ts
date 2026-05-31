
import { getSupabaseServer } from '@/lib/dal'
import { redirect } from 'next/navigation'

export async function GET() {
    const supabase = await getSupabaseServer()
    await supabase.auth.signOut()
    return redirect('/auth/login')
}

export async function POST(request: Request) {
    const supabase = await getSupabaseServer()
    await supabase.auth.signOut()
    return redirect('/auth/login')
}
