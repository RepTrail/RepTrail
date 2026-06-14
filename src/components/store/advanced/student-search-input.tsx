'use client'

import React from 'react'
import { Input } from '@/components/store/base/input'
import { Icon } from '@/components/store/base/icon'
import { Box } from '@/components/store/base/box'
import { Search } from 'lucide-react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

export function StudentSearchInput() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const search = searchParams?.get('q') || ''

    return (
        <Box width={{ base: 'full', md: 'auto' }}>
            <Input
                type="text"
                placeholder="Buscar aluno..."
                value={search}
                onChange={(e) => {
                    const params = new URLSearchParams(searchParams?.toString() || '')
                    if (e.target.value) {
                        params.set('q', e.target.value)
                    } else {
                        params.delete('q')
                    }
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
                }}
                icon={<Icon icon={Search} size="xs" />}
            />
        </Box>
    )
}
