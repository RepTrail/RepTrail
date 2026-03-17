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

    // Block trainers from accessing /onboarding
    if (request.nextUrl.pathname.startsWith('/onboarding') && user) {
        const metaRole = user.user_metadata?.role
        if (metaRole === 'trainer') {
            return NextResponse.redirect(new URL('/dashboard/trainer', request.url))
        }
    }

    // Paywall checks for Dashboard
    if (user && request.nextUrl.pathname.startsWith('/dashboard')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role, plan_tier, elite_until, auto_training_status, auto_training_trial_end')
            .eq('id', user.id)
            .single()

        const effectiveRole = profile?.role || user.user_metadata?.role
        console.log(`[Middleware] Path: ${request.nextUrl.pathname}, Role: ${effectiveRole}`)

        // --- TRAINER PAYWALL ---
        if (effectiveRole === 'trainer' && request.nextUrl.pathname.startsWith('/dashboard/trainer') && !request.nextUrl.pathname.includes('/plans')) {
            const now = new Date()
            const isEliteTrial = profile?.plan_tier === 'elite' && !!profile?.elite_until
            const isTrialExpired = isEliteTrial && profile?.elite_until && new Date(profile.elite_until) <= now
            const hasPlan = !!profile?.plan_tier && profile?.plan_tier !== 'none' && !isTrialExpired

            if (!hasPlan) {
                return NextResponse.redirect(new URL('/dashboard/trainer/plans', request.url))
            }
        }

        // --- STUDENT AUTO-TRAINING PAYWALL ---
        if (effectiveRole === 'student' && request.nextUrl.pathname.startsWith('/dashboard/student')) {
            const pathUrl = request.nextUrl.pathname;
            const isProtectedAutoTrainingRoute =
                pathUrl.startsWith('/dashboard/student/workouts') ||
                pathUrl.startsWith('/dashboard/student/diet') ||
                pathUrl.startsWith('/dashboard/student/cardio') ||
                pathUrl.startsWith('/dashboard/student/ergogenics') ||
                pathUrl.startsWith('/dashboard/student/import-pdf');

            if (isProtectedAutoTrainingRoute) {
                // Check if they have an active personal trainer
                const { count } = await supabase
                    .from('trainer_students')
                    .select('*', { count: 'exact', head: true })
                    .eq('student_id', user.id)
                    .eq('active', true)

                const hasTrainer = (count || 0) > 0;

                if (!hasTrainer && !pathUrl.includes('/plans')) {
                    const now = new Date()
                    let activeAutoTraining = false;

                    if (profile?.auto_training_status === 'active') {
                        activeAutoTraining = true;
                    } else if (profile?.auto_training_status === 'trial' && profile?.auto_training_trial_end) {
                        const trialEnd = new Date(profile.auto_training_trial_end)
                        if (now <= trialEnd) {
                            activeAutoTraining = true;
                        }
                    }

                    if (!activeAutoTraining) {
                        // If no active auto training and no personal, block access.
                        return NextResponse.redirect(new URL('/dashboard/student/plans', request.url))
                    }
                }
            }
        }

        // Cross-dashboard protection is handled by individual layouts, not middleware.
        // Relying on role here (DB or metadata) caused redirect loops when roles were mismatched.
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
