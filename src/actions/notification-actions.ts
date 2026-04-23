
'use server'

import webpush from 'web-push'
import { createClient } from '@/lib/supabase/server'

// Initial config
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_VAPID_KEY) {
    webpush.setVapidDetails(
        'mailto:suporte@reptrail.com.br',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_VAPID_KEY
    )
}

export async function sendPushNotification(userId: string, title: string, body: string, url?: string) {
    const supabase = /* ❌ OUTBOX VIOLATION */ await createClient()

    const { data: subs, error } = await supabase
        .from('push_subscriptions')
        .select('subscription')
        .eq('user_id', userId)

    if (error || !subs || subs.length === 0) {
        console.error('No push subscriptions found for user:', userId)
        return { success: false, error: 'Sem inscrição' }
    }

    const payload = JSON.stringify({
        title,
        body,
        url: url || '/dashboard/student'
    })

    const results = await Promise.all(subs.map(async (s: any) => {
        try {
            await webpush.sendNotification(s.subscription, payload)
            return { success: true }
        } catch (e: any) {
            console.error('Error sending push:', e.message)
            if (e.statusCode === 410 || e.statusCode === 404) {
                // Subscription expired, remove it
                await supabase.from('push_subscriptions').delete().eq('user_id', userId).eq('subscription', s.subscription)
            }
            return { success: false, error: e.message }
        }
    }))

    return { success: true, results }
}
