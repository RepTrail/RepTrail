'use client'

import { Button } from '@/components/store/base/button'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { ArrowRight } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import Link from 'next/link'

interface ReturnButtonProps {
    href: string
    label?: string
}

export function ReturnButton({ href, label = 'Voltar' }: ReturnButtonProps) {
    return (
        <Link href={href}>
            <Button
                variant="outline-zinc"
                size="sm"
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                text={label}
                iconLeft={ArrowRight} />
        </Link>
    );
}
