import { createClient as createBrowserClient, removeChannelWithGrace as removeChannelGrace } from '@/lib/supabase/client'

export function getSupabaseClient() {
  return createBrowserClient()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeChannelWithGrace(supabase: any, channel: any) {
  return removeChannelGrace(supabase, channel)
}

export * from '@/actions/admin-actions'
export * from '@/actions/admin-plan-actions'
export * from '@/actions/plan-features-actions'
export * from '@/actions/admin-affiliate-actions'
export * from '@/actions/affiliate-actions'
export * from '@/actions/ai-protocol-actions'
export * from '@/actions/app-settings-actions'
export * from '@/actions/asaas-actions'
export * from '@/actions/auth-actions'
export * from '@/actions/auto-training-actions'
export * from '@/actions/cardio-actions'
export * from '@/actions/code-actions'
export * from '@/actions/diet-actions'
export * from '@/actions/ergogenics-actions'
export * from '@/actions/log-actions'
export * from '@/actions/metrics-actions'
export * from '@/actions/notification-actions'
export * from '@/actions/onboarding-actions'
export * from '@/actions/pdf-actions'
export * from '@/actions/profile-actions'
export * from '@/actions/save-actions'
export * from '@/actions/store-actions'
export * from '@/actions/student-actions'
export * from '@/actions/student-content-actions'
export * from '@/actions/tracking-actions'
export * from '@/actions/trainer-actions'
export * from '@/actions/workout-actions'
export * from '@/actions/terms-actions'
export * from '@/actions/student-workout-schedule-actions'

export { updateTrainerProfile } from '@/actions/trainer-actions'
