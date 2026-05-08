'use client'

import React from 'react'
import { Stack } from '../base/stack'
import { Font } from '../base/font'
import { GlassPanel } from '../base/surface'
import { Box } from '../base/box'
import { Button } from '../base/button'
import { Inline } from '../base/layout'
import { Badge } from '../base/badge'
import { ShoppingBag, Edit3, Trash2, Power } from 'lucide-react'

interface ProductCardProps {
    name: string
    price: string
    category: string
    isActive?: boolean
    image?: string
    onToggleActive?: () => void
    onEdit?: () => void
    onDelete?: () => void
}

export function ProductCard({ 
    name, 
    price, 
    category, 
    isActive = true,
    image,
    onToggleActive,
    onEdit,
    onDelete 
}: ProductCardProps) {
    return (
        <GlassPanel 
            padding={0} 
            overflow="hidden"
            className="group hover:border-white/20 transition-all duration-300 flex flex-col h-full"
        >
            {/* Product Image - Aspect Ratio 1:1 */}
            <div className="relative aspect-square w-full bg-zinc-900 overflow-hidden">
                {image ? (
                    <img 
                        src={image} 
                        alt={name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                ) : (
                    <Stack fullHeight align="center" justify="center" opacity={10}>
                        <ShoppingBag size={48} className="text-zinc-500" />
                    </Stack>
                )}
                
                {/* Category Badge - Standard Component */}
                <div className="absolute top-4 left-4 z-10">
                    <Badge 
                        label={category} 
                        variant="glass" 
                        color="orange" 
                        size="sm" 
                        rounded="full" 
                    />
                </div>

                {/* Quick Actions (Hover Overlay) */}
                <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                    <Button variant="outline-blue" size="sm" rounded="full" isIconOnly onClick={onEdit}>
                        <Edit3 size={14} />
                    </Button>
                    <Button variant="outline-red" size="sm" rounded="full" isIconOnly onClick={onDelete}>
                        <Trash2 size={14} />
                    </Button>
                </div>
            </div>

            {/* Product Info - Refined Typography */}
            <Stack padding={5} gap={2.5} flex1 justify="between">
                <Stack gap={1}>
                    <Font weight="black" uppercase italic color="white" className="text-xs tracking-wider opacity-80">
                        {name}
                    </Font>
                    <Font weight="black" color="white" className="text-lg">
                        {price}
                    </Font>
                </Stack>

                {/* Action Button - Toggle State */}
                <Button 
                    variant={isActive ? 'outline-emerald' : 'outline-red'} 
                    size="sm" 
                    fullWidth 
                    onClick={onToggleActive}
                    className="mt-2"
                >
                    <Inline gap={2.5} align="center">
                        <Power size={12} />
                        <Font variant="label-caps">
                            {isActive ? 'Ativado' : 'Desativado'}
                        </Font>
                    </Inline>
                </Button>
            </Stack>
        </GlassPanel>
    )
}
