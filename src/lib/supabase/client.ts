
import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'

let client: SupabaseClient | undefined
const pendingRemovals = new Map<string, NodeJS.Timeout>()

export function createClient() {
  if (client) return client

  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return client
}

/**
 * Removes a channel with a small grace period.
 * This prevents WebSocket closure loops during React 18 Strict Mode mount/unmount cycles.
 */
export function removeChannelWithGrace(supabase: SupabaseClient, channel: RealtimeChannel) {
  const channelName = channel.topic
  
  // Clear any pending removal for this channel name (if we are re-subscribing)
  if (pendingRemovals.has(channelName)) {
    clearTimeout(pendingRemovals.get(channelName))
    pendingRemovals.delete(channelName)
  }

  const timeout = setTimeout(() => {
    supabase.removeChannel(channel)
    pendingRemovals.delete(channelName)
  }, 1000) // 1s grace period

  pendingRemovals.set(channelName, timeout)
}
