'use server'

export async function resetAutoTrainingOnboardingModal(userId: string) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    return await supabase
        .from('profiles')
        .update({ saw_auto_training_onboarding_modal: false })
        .eq('id', userId)
}

export async function dismissAutoTrainingForSession(userId: string) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    return await supabase
        .from('profiles')
        .update({
            saw_auto_training_onboarding_modal: true,
        })
        .eq('id', userId)
}

export async function enableAutoTrainingTrialForCurrentUser() {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'Unauthorized' }
    }

    const { data: current, error: currentErr } = await supabase
        .from('profiles')
        .select('auto_training_status, auto_training_trial_end, auto_training_trial_used')
        .eq('id', user.id)
        .maybeSingle()

    if (currentErr) {
        return { success: false, error: currentErr.message }
    }

    const now = new Date()
    const trialEndExisting = (current as any)?.auto_training_trial_end ? new Date((current as any).auto_training_trial_end) : null
    const isWithinTrialPeriod = trialEndExisting && now <= trialEndExisting
    const hasUsedTrial = !!(current as any)?.auto_training_trial_used

    if (hasUsedTrial && !isWithinTrialPeriod) {
        return { success: false, error: 'Seu período de 7 dias já expirou.' }
    }

    // If they haven't started trial yet, set the 7 days
    const updateData: any = {
        saw_auto_training_onboarding_modal: true,
    }

    if (!hasUsedTrial) {
        updateData.auto_training_status = 'trial'
        updateData.auto_training_trial_end = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        updateData.auto_training_trial_used = true
    }

    const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true }
}

export async function getAutoTrainingTrialInfoForCurrentUser() {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const { data, error } = await supabase
        .from('profiles')
        .select('auto_training_status, auto_training_trial_end, auto_training_trial_used')
        .eq('id', user.id)
        .maybeSingle()

    if (error) {
        return null
    }

    return data
}

export async function getStudentAutoTrainingStatus(userId: string) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error, status } = await supabase
        .from('profiles')
        .select('auto_training_status, auto_training_trial_end, auto_training_trial_used, saw_auto_training_onboarding_modal')
        .eq('id', userId)
        .maybeSingle()

    if (error) {
        console.error('Error fetching auto training status:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint,
            status,
        })
        return null
    }

    return data
}
