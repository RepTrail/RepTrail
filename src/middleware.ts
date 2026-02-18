import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', request.nextUrl.pathname)

    let response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    // Create a supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid calling getUser() if you don't need user data in middleware
    // to prevent unnecessary database hits on every request.
    // However, since we protect /dashboard, we need it.
    const { data: { user } } = await supabase.auth.getUser()

    // Protect /dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Redirect authenticated users away from /auth
    if (request.nextUrl.pathname.startsWith('/auth') && user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Trainer Paywall Check in Middleware
    if (user && request.nextUrl.pathname.startsWith('/dashboard/trainer') && !request.nextUrl.pathname.includes('/plans')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, plan_tier, elite_until')
            .eq('id', user.id)
            .single()

        if (profile?.role === 'trainer') {
            const now = new Date()
            const isEliteTrial = profile?.plan_tier === 'elite' && !!profile?.elite_until
            const isTrialExpired = isEliteTrial && new Date(profile.elite_until) <= now
            const hasPlan = !!profile?.plan_tier && profile.plan_tier !== 'none' && !isTrialExpired

            if (!hasPlan) {
                return NextResponse.redirect(new URL('/dashboard/trainer/plans', request.url))
            }
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
