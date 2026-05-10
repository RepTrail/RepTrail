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
    description?: string
    image?: string
    isActive?: boolean
    onToggleActive?: () => void
    onEdit?: () => void
    onDelete?: () => void
}

export function ProductCard({ 
    name, 
    price, 
    category, 
    description,
    image,
    isActive = true,
    onToggleActive,
    onEdit,
    onDelete 
}: ProductCardProps) {
    let cleanedName = name.replace(/&amp;/gi, '&').replace(/&amp;/gi, '&')
    cleanedName = cleanedName.replace(/\s*-\s*R\$\s*\d+([.,]\d+)?\s*$/i, '')

    return (
        <GlassPanel 
            padding={0} 
            overflow="hidden"
            group
            transition
            fullHeight
            display="flex"
            direction="col"
            style={{ border: '1px solid rgba(255,255,255,0.05)' }} // Base border, hover handled by Interactive/ActionSurface normally, but GlassPanel handles its own. We just rely on base variants.
        >
            {/* Product Image - Aspect Ratio 1:1 */}
            <Box position="relative" fullWidth bg="zinc-950" overflow="hidden" style={{ aspectRatio: '1 / 1' }}>
                {image ? (
                    <Box 
                        as="img"
                        src={image} 
                        alt={cleanedName} 
                        width="100%"
                        height="100%"
                        style={{ objectFit: 'cover' }}
                        className="group-hover:scale-110 transition-transform duration-500" 
                    />
                ) : (
                    <Stack fullHeight align="center" justify="center" opacity={10}>
                        <ShoppingBag size={48} className="text-zinc-500" />
                    </Stack>
                )}
                
                {/* Category Badge - Standard Component */}
                <Box position="absolute" style={{ top: 16, left: 16, zIndex: 10 }}>
                    <Badge 
                        label={category} 
                        variant="glass" 
                        color="orange" 
                        size="sm" 
                        rounded="full" 
                    />
                </Box>

                {/* Quick Actions (Hover Overlay) */}
                <Stack 
                    direction="row"
                    position="absolute" 
                    align="center" 
                    justify="center" 
                    gap={2.5}
                    style={{ inset: 0, backgroundColor: 'rgba(9, 9, 11, 0.6)', backdropFilter: 'blur(4px)' }}
                    opacity={0}
                    groupHoverOpacity={100}
                    transition
                >
                    <Button variant="outline-blue" size="sm" rounded="full" isIconOnly onClick={onEdit}>
                        <Edit3 size={14} />
                    </Button>
                    <Button variant="outline-red" size="sm" rounded="full" isIconOnly onClick={onDelete}>
                        <Trash2 size={14} />
                    </Button>
                </Stack>
            </Box>

            {/* Product Info - Refined Typography */}
            <Stack padding={5} gap={2.5} flex1 justify="between">
                <Stack gap={1}>
                    <Font weight="black" uppercase italic color="white" tracking="wide" variant="body-sm">
                        {cleanedName}
                    </Font>
                    {description && (
                        <Box style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            <Font variant="sub-tiny" color="zinc-500">
                                {description}
                            </Font>
                        </Box>
                    )}
                    <Box paddingTop={1}>
                        <Font weight="black" color="emerald" variant="heading">
                            {price}
                        </Font>
                    </Box>
                </Stack>

                {/* Action Button - Toggle State */}
                <Box paddingTop={2.5}>
                    <Button 
                        variant={isActive ? 'outline-emerald' : 'outline-red'} 
                        size="sm" 
                        fullWidth 
                        onClick={onToggleActive}
                    >
                        <Inline gap={2.5} align="center">
                            <Power size={12} />
                            <Font variant="label-caps">
                                {isActive ? 'Ativado' : 'Desativado'}
                            </Font>
                        </Inline>
                    </Button>
                </Box>
            </Stack>
        </GlassPanel>
    )
}
