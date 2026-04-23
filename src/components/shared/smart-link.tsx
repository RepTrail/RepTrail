'use client'

import Link, { LinkProps } from 'next/link'
import { ReactNode, useCallback } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'

interface PrefetchConfig {
    queryKey: any[]
    queryFn: () => Promise<any>
}

interface SmartLinkProps extends LinkProps {
    children: ReactNode
    className?: string
    prefetchKey?: any[]
    prefetchFn?: () => Promise<any>
    prefetchConfigs?: PrefetchConfig[]
}

/**
 * SmartLink: achieves 0ms navigation by prefetching TanStack Query data on hover.
 */
export function SmartLink({ 
    children, 
    className, 
    prefetchKey, 
    prefetchFn,
    prefetchConfigs = [],
    ...props 
}: SmartLinkProps) {
    const queryClient = useQueryClient()

    const handleMouseEnter = useCallback(() => {
        const configs = [...prefetchConfigs]
        
        if (prefetchKey && prefetchFn) {
            configs.push({ queryKey: prefetchKey, queryFn: prefetchFn })
        }

        configs.forEach(config => {
            queryClient.prefetchQuery({
                queryKey: config.queryKey,
                queryFn: config.queryFn,
                staleTime: Infinity,
            })
        })
    }, [queryClient, prefetchKey, prefetchFn, prefetchConfigs])

    return (
        <Link 
            {...props} 
            className={className}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleMouseEnter} // Better for mobile
        >
            {children}
        </Link>
    )
}
