import React from 'react'
import { Font } from './font'
import { Box } from './box'

interface BaseAvatarProps {
    initials: string
    variant?: 'orange' | 'emerald' | 'red' | 'blue' | 'amber' | 'zinc'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    src?: string
    className?: string
}

export function BaseAvatar({
    initials,
    variant = 'zinc',
    size = 'md'
}: BaseAvatarProps) {
    return (
        <Box
            bg="zinc-900"
            border={variant === 'zinc' ? 'zinc-800' : variant}
            rounded="full"
            height={size === 'sm' ? '8' : size === 'md' ? '12' : '16'}
            width={size === 'sm' ? '8' : size === 'md' ? '12' : '16'}
            overflow="hidden"
            display="flex"
            align="center"
            justify="center"
            shrink0
        >
            <Font weight="black" color={variant} variant={size === 'sm' ? 'sub-tiny' : 'body'} align="center">{initials}</Font>
        </Box>
    )
}
