'use client'

import React from 'react'
import { EmptyState404 } from '@/components/store/advanced/empty-state-404'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-950 overflow-hidden">
      <EmptyState404 />
    </main>
  )
}
