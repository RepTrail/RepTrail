'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Surface } from '@/components/store/base/surface'
import { Icon } from '@/components/store/base/icon'
import { Button } from '@/components/store/base/button'
import { FileUpload } from '@/components/store/base/file-upload'
import { ShieldCheck } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface StudentProfileSummaryProps {
    name: string
    email: string
}

/**
 * StudentProfileSummary: Advanced component for the main profile identification card.
 * Extracted from StudentProfileSectionContent.
 * Preserves exact alignment, padding, and token usage.
 */
export function StudentProfileSummary({ name, email }: StudentProfileSummaryProps) {
    return (
        <Surface variant="glass" padding={STORE_TOKENS.PADDING.CONTAINER} rounded={STORE_TOKENS.RADIUS.SYSTEM} border="none">
            <Stack align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                <FileUpload 
                    label="FOTO DE PERFIL" 
                    variant="profile" 
                    onFileSelect={(file) => console.log('Selected file:', file)} 
                />

                <Stack align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="h3" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} align="center">
                        {name}
                    </Font>
                    <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="black" uppercase tracking="widest">
                        {email}
                    </Font>
                </Stack>

                <Button variant="outline-orange" fullWidth size="lg">
                    <Stack direction="row" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Icon icon={ShieldCheck} size="xs" />
                        <Font variant="body-sm" weight="black" uppercase italic>VER PERFIL PÚBLICO</Font>
                    </Stack>
                </Button>
            </Stack>
        </Surface>
    )
}
