import { createClient as createBrowserClient, removeChannelWithGrace as removeChannelGrace } from '@/lib/supabase/client'

export function getSupabaseClient() {
  return createBrowserClient()
}

export function removeChannelWithGrace(supabase: any, channel: any) {
  return removeChannelGrace(supabase, channel)
}

export async function getProfileRole(userId: string): Promise<string | null> {
  const supabase = createBrowserClient()
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  return data?.role || null
}

export async function uploadPdf(filePath: string, file: File) {
  const supabase = createBrowserClient()
  return supabase.storage.from('pdfs').upload(filePath, file)
}

export function subscribeToActivityFeed(userId: string, onUpdate: () => void) {
  const supabase = createBrowserClient()
  const channel = supabase
    .channel(`trainer-activity-refetch-${userId}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'workout_logs' },
      onUpdate
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'meal_logs' },
      onUpdate
    )
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'cardio_logs' },
      onUpdate
    )
    .subscribe()

  return () => {
    removeChannelGrace(supabase, channel)
  }
}

export function subscribeToPublicFeed(onUpdate: () => void) {
  const supabase = createBrowserClient()
  const channel = supabase
    .channel('public-feed-sync')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'progress_photos' },
      onUpdate
    )
    .subscribe()

  return () => {
    removeChannelGrace(supabase, channel)
  }
}

