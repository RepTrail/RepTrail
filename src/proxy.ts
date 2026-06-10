import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', request.nextUrl.pathname)

    // Create a supabase client
    let supabaseResponse = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

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
                    // Reset response with modified headers to preserve them
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: requestHeaders,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Avoid calling getUser() in proxy/middleware (can be slow) - use claims instead.
    const { data: claimsData } = await supabase.auth.getClaims()
    const userId = claimsData?.claims?.sub || null

    if (userId) requestHeaders.set('x-user-id', userId)

    // Protect /dashboard routes
    if (request.nextUrl.pathname.startsWith('/dashboard') && !userId) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin') && !userId) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // Redirect /admin (exact) to /admin/dashboard
    if (request.nextUrl.pathname === '/admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // Redirect authenticated users away from /auth (except logout)
    if (request.nextUrl.pathname.startsWith('/auth') && !request.nextUrl.pathname.startsWith('/auth/logout') && userId) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Final response reconstruction to ensure ALL headers (including x-user-id) 
    // are passed to the Server Actions / Pages
    const finalResponse = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    // Copy cookies from supabaseResponse (which might have new session tokens)
    supabaseResponse.cookies.getAll().forEach(cookie => {
        finalResponse.cookies.set(cookie.name, cookie.value)
    })

    return finalResponse
}

export const config = {
    matcher: ['/dashboard/:path*', '/admin/:path*', '/auth/:path*', '/aluno/:path*', '/personal/:path*', '/onboarding/:path*'],
}
