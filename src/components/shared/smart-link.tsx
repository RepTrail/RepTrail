'use client'

import Link, { LinkProps } from 'next/link'
import { ReactNode, useCallback } from 'react'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'

interface PrefetchConfig {
    queryKey: QueryKey
    queryFn: () => Promise<any>
}

interface SmartLinkProps extends LinkProps {
    children: ReactNode
    id?: string
    className?: string
    prefetchKey?: QueryKey
    prefetchFn?: () => Promise<any>
    prefetchConfigs?: PrefetchConfig[]
}

/**
 * SmartLink: achieves 0ms navigation by prefetching TanStack Query data on hover.
 */
export function SmartLink({ 
    children, 
    id,
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
            id={id}
            className={className}
            onMouseEnter={handleMouseEnter}
            onTouchStart={handleMouseEnter} // Better for mobile
        >
            {children}
        </Link>
    )
}
