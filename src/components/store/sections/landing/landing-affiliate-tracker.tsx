'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function TrackerContent() {
    const searchParams = useSearchParams()
    const supabase = createClient()

    useEffect(() => {
        const refToken = searchParams.get('ref')
        if (!refToken) return

        // Save to cookie (simple way)
        const expires = new Date()
        expires.setTime(expires.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days
        document.cookie = `rt_affiliate_token=${refToken};expires=${expires.toUTCString()};path=/;SameSite=Lax`

        // Log click if not already logged for this token in this session
        const sessionKey = `logged_ref_${refToken}`
        const hasLoggedClick = sessionStorage.getItem(sessionKey)

        if (!hasLoggedClick) {
            const logClick = async () => {
                try {
                    // Find affiliate by token and log click
                    const { data: affiliate, error } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('affiliate_token', refToken)
                        .single()

                    if (affiliate && !error) {
                        await supabase.from('affiliate_clicks').insert({
                            affiliate_id: affiliate.id,
                            referrer_url: document.referrer,
                            user_agent: navigator.userAgent
                        })
                        sessionStorage.setItem(sessionKey, 'true')
                    }
                } catch (e) {
                    console.error('Failed to log affiliate click:', e)
                }
            }
            logClick()
        }
    }, [searchParams, supabase])

    return null
}

export function AffiliateTracker() {
    return (
        <Suspense fallback={null}>
            <TrackerContent />
        </Suspense>
    )
}
