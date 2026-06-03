// Contrato público de dados Local-First no lado do Servidor (DAL Server)
// Apenas Server Components, Server Actions ou Route Handlers devem importar deste arquivo.

import { createClient as createServerClient } from '@/lib/supabase/server'

export async function getSupabaseServer() {
  return createServerClient()
}

export async function getProfile(userId: string) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export async function signOut() {
  const supabase = await getSupabaseServer()
  await supabase.auth.signOut()
}

export async function checkAdminSession() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, isAdmin: false }
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  return { user, isAdmin: !!profile?.is_admin }
}

export async function getLandingSessionInfo() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return {
      user: null,
      role: null,
      isAffiliate: false,
      dashboardUrl: '/dashboard/student'
    }
  }

  const [profileResult, affiliateResult] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).maybeSingle(),
    supabase.from('affiliates').select('*', { count: 'exact', head: true }).eq('user_id', user.id)
  ])

  const role = profileResult.data?.role || null
  const isAffiliate = Boolean(affiliateResult.count && affiliateResult.count > 0)

  const dashboardUrl = role === 'admin' ? '/admin' :
    role === 'trainer' ? '/dashboard/trainer' :
      '/dashboard/student'

  return {
    user,
    role,
    isAffiliate,
    dashboardUrl
  }
}

export async function getOnboardingSessionInfo() {
  const supabase = await getSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, role: null, onboardingCompleted: false, trainerCode: '' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, onboarding_completed')
    .eq('id', user.id)
    .single()

  const role = profile?.role || user.user_metadata?.role || null
  const onboardingCompleted = !!profile?.onboarding_completed
  let trainerCode = user.user_metadata?.trainer_code || ''

  // Se o aluno já tiver um vínculo ativo (ex: migração de ghost profile), puxamos o código automaticamente
  if (!trainerCode && role === 'student') {
    const { createAdminClient } = await import('@/lib/supabase/admin')
    const adminSupabase = await createAdminClient()
    
    const { data: trainerLink, error: linkError } = await adminSupabase
      .from('trainer_students')
      .select('trainer:profiles!trainer_id(trainer_code)')
      .eq('student_id', user.id)
      .eq('active', true)
      .maybeSingle()

    if (linkError) {
      console.error('[ONBOARDING] Error fetching trainer link:', linkError)
    }

    if (trainerLink?.trainer) {
      const t = Array.isArray(trainerLink.trainer) ? trainerLink.trainer[0] : trainerLink.trainer;
      if (t?.trainer_code) {
        console.log(`[ONBOARDING] Found trainer code from link: ${t.trainer_code}`)
        trainerCode = t.trainer_code
      }
    }
  }

  return {
    user,
    role,
    onboardingCompleted,
    trainerCode
  }
}

export async function getStudentLayoutData(userId: string) {
  const supabase = await getSupabaseServer()
  const [profileRes, detailsRes] = await Promise.all([
    supabase.from('profiles').select('role, full_name, avatar_url, email, auto_training_status, auto_training_trial_end, is_admin, is_affiliate').eq('id', userId).single(),
    supabase.from('student_details').select('id, steroid_use').eq('id', userId).single()
  ])
  return {
    profile: profileRes.data,
    details: detailsRes.data
  }
}

export async function getStudentPublicProfileData(studentId: string, viewerId?: string | null) {
  const supabase = await getSupabaseServer()
  
  let viewerProfile: any = null
  if (viewerId) {
    const { data } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url, email, is_admin, is_affiliate')
      .eq('id', viewerId)
      .single()
    viewerProfile = data
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, created_at')
    .eq('id', studentId)
    .single()

  if (!profile) return null

  const [detailsResult, trainerLinkResult, photosResult] = await Promise.all([
    supabase
      .from('student_details')
      .select('steroid_use')
      .eq('id', studentId)
      .single(),
    supabase
      .from('trainer_students')
      .select(`
        active,
        trainer:profiles!trainer_id(
          id, full_name, avatar_url, trainer_code
        )
      `)
      .eq('student_id', studentId)
      .eq('active', true)
      .maybeSingle(),
    supabase
      .from('progress_photos')
      .select('*')
      .eq('student_id', studentId)
      .eq('is_private', false)
      .order('created_at', { ascending: false }),
  ])

  return {
    viewerProfile,
    profile,
    details: detailsResult.data,
    trainerLink: trainerLinkResult.data,
    photos: photosResult.data
  }
}

export async function getStudentDetails(userId: string) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('student_details')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

export async function getStudentTrainerReview(userId: string, trainerId: string) {
  const supabase = await getSupabaseServer()
  const { data } = await supabase
    .from('trainer_reviews')
    .select('*')
    .eq('student_id', userId)
    .eq('trainer_id', trainerId)
    .maybeSingle()
  return data
}

export async function getTrainerPublicProfileData(normalizedSlug: string, viewerId?: string | null) {
  const supabase = await getSupabaseServer()
  
  const { data: publicData, error: rpcError } = await supabase
    .rpc('get_trainer_public_profile', { trainer_slug: normalizedSlug })

  if (rpcError || !publicData) {
    console.error('Error fetching public profile via RPC:', rpcError)
    return null
  }

  let viewerProfile: any = null
  if (viewerId) {
    const { data } = await supabase
      .from('profiles')
      .select('role, full_name, avatar_url, email, is_admin, is_affiliate')
      .eq('id', viewerId)
      .single()
    viewerProfile = data
  }

  return {
    publicData,
    viewerProfile
  }
}

export async function getStudentProgressPageData(userId: string) {
  const supabase = await getSupabaseServer()

  const [profileResult, trainerLinkResult, progressPhotosResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, created_at')
      .eq('id', userId)
      .single(),
    supabase
      .from('trainer_students')
      .select(`
        active,
        trainer:profiles!trainer_id(
          id, full_name, avatar_url, trainer_code
        )
      `)
      .eq('student_id', userId)
      .eq('active', true)
      .maybeSingle(),
    supabase
      .from('progress_photos')
      .select('id, front_url, back_url, side_right_url, side_left_url, created_at')
      .eq('student_id', userId)
      .order('created_at', { ascending: false })
  ])

  return {
    profile: profileResult.data,
    trainerLink: trainerLinkResult.data,
    progressPhotos: progressPhotosResult.data || []
  }
}

export * as actions from './remote'

