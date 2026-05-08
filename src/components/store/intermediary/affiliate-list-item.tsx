'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Inline } from '../base/layout'
import { Font } from '../base/font'
import { BaseAvatar } from '../base/avatar'
import { Badge } from '../base/badge'
import { Button } from '../base/button'
import { GlassPanel } from '../base/surface'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AffiliateListItemProps {
    name: string
    email: string
    affiliateId: string
    registrationDate: string
    referrals: {
        total: number
        active: number
    }
    revenue: string
    commission: string
    rate: number
    avatarUrl?: string | null
    onDelete?: () => void
}

export function AffiliateListItem({
    name,
    email,
    affiliateId,
    registrationDate,
    referrals,
    revenue,
    commission,
    rate,
    avatarUrl,
    onDelete
}: AffiliateListItemProps) {
    return (
        <GlassPanel
            padding={0}
            className="group relative overflow-hidden transition-all duration-300 hover:border-white/20"
        >
            <div className="flex flex-row w-full relative min-h-[100px]">

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col justify-center lg:flex-row lg:items-center lg:justify-between p-5 gap-5">
                    {/* Identity Block */}
                    <Inline gap={5} align="center">
                        <BaseAvatar
                            src={avatarUrl || undefined}
                            initials={name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            variant="zinc"
                            size="md"
                        />
                        <Stack gap={0}>
                            <Font weight="black" uppercase italic color="white" className="text-sm md:text-base tracking-wider">{name}</Font>
                            <Font variant="sub-tiny" color="zinc-600" className="lowercase truncate max-w-[150px] md:max-w-none mb-1">{email}</Font>
                            <div className="flex">
                                <Badge label={affiliateId} variant="glass" size="xs" color="zinc" rounded="system" />
                            </div>
                        </Stack>
                    </Inline>

                    {/* Badges Block */}
                    <div className={cn(
                        "transition-transform duration-500 ease-out",
                        onDelete && "lg:group-hover:-translate-x-[100px]"
                    )}>
                        <Inline gap={2.5} align="center" wrap>
                            <Badge label={registrationDate} variant="glass" rounded="full" size="xs" />
                            <Badge
                                label={`${referrals.total} / ${referrals.active} ATIVOS`}
                                variant="glass"
                                color="emerald"
                                rounded="full"
                                size="xs"
                            />
                            <Badge label={revenue} variant="glass" color="zinc" rounded="full" size="xs" />
                            <Badge label={`${commission} ESTIMADO`} variant="glass" color="emerald" rounded="full" size="xs" />
                            <Badge label={`${rate}%`} variant="glass" color="blue" rounded="full" size="xs" />
                        </Inline>
                    </div>
                </div>

                {/* Actions Sidebar */}
                {onDelete && (
                    <div className={cn(
                        "flex flex-col lg:flex-row items-center justify-center bg-zinc-950/40 lg:bg-zinc-950/90 backdrop-blur-xl border-l border-white/10 p-4 lg:px-5 lg:py-0 transition-all duration-500 ease-out",
                        "relative lg:absolute lg:right-0 lg:top-0 lg:h-full lg:translate-x-full lg:group-hover:translate-x-0"
                    )}>
                        <Button
                            variant="outline-red"
                            size="sm"
                            rounded="full"
                            isIconOnly
                            onClick={onDelete}
                            className="hover:scale-110 transition-transform active:scale-95"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                )}
            </div>
        </GlassPanel>
    )
}
