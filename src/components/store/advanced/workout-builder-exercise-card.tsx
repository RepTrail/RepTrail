'use client'

import React from 'react'
import { GlassPanel, CardHeader, CardContent } from '@/components/store/base/surface'
import { Separator } from '@/components/store/base/separator'
import { Stack } from '@/components/store/base/stack'
import { Inline } from '@/components/store/base/layout'
import { Grid } from '@/components/store/base/grid'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Input } from '@/components/store/base/input'
import { Button } from '@/components/store/base/button'
import { Textarea } from '@/components/store/base/textarea'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { GripVertical, Trash2 } from 'lucide-react'

export interface WorkoutBuilderExerciseCardProps {
    item: any
    isDragged: boolean
    onDragStart: (e: React.DragEvent, id: string) => void
    onDragOver: (e: React.DragEvent, id: string) => void
    onDragEnd: () => void
    onRemove: (id: string) => void
    onUpdate: (id: string, data: any) => void
}

export function WorkoutBuilderExerciseCard({
    item,
    isDragged,
    onDragStart,
    onDragOver,
    onDragEnd,
    onRemove,
    onUpdate
}: WorkoutBuilderExerciseCardProps) {
    return (
        <Box
            as="div"
            draggable
            onDragStart={(e: any) => onDragStart(e, item.id)}
            onDragOver={(e: any) => onDragOver(e, item.id)}
            onDragEnd={onDragEnd}
            transition
            cursor="pointer"
            opacity={isDragged ? STORE_TOKENS.OPACITY.SIDEBAR : STORE_TOKENS.OPACITY.FULL}
            scale={isDragged ? 95 : 100}
        >
            <GlassPanel border="subtle">
                <CardHeader
                    {...{
                        padding: STORE_TOKENS.SPACING.ELEMENT,
                    }}>
                    <Stack direction="col" gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>
                        <Box display={{ base: 'flex', md: 'none' }} align="center" justify="between" width="full">
                            <Button
                                variant="outline-primary"
                                isIconOnly
                                size="sm"
                                asChild
                            >
                                <Box>
                                    <Icon icon={GripVertical} size="sm" />
                                </Box>
                            </Button>
                            <Button
                                variant="outline-red"
                                isIconOnly
                                size="sm"
                                onClick={() => onRemove(item.id)}
                            >
                                <Icon icon={Trash2} size="sm" />
                            </Button>
                        </Box>

                        <Box display="flex" align="center" justify={{ base: 'start', md: 'between' }} width="full">
                            <Inline align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Box display={{ base: 'none', md: 'block' }}>
                                    <Button
                                        variant="outline-primary"
                                        isIconOnly
                                        size="sm"
                                        asChild
                                    >
                                        <Box>
                                            <Icon icon={GripVertical} size="sm" />
                                        </Box>
                                    </Button>
                                </Box>
                                <Font
                                    variant="heading"
                                    uppercase
                                    {...{
                                        color: STORE_TOKENS.COLORS.WHITE,
                                    }}>
                                    {item.exercise.name}
                                </Font>
                            </Inline>
                            <Box display={{ base: 'none', md: 'block' }}>
                                <Button
                                    variant="outline-red"
                                    isIconOnly
                                    size="sm"
                                    onClick={() => onRemove(item.id)}
                                >
                                    <Icon icon={Trash2} size="sm" />
                                </Button>
                            </Box>
                        </Box>
                    </Stack>
                </CardHeader>
                <CardContent
                    {...{
                        padding: STORE_TOKENS.SPACING.ELEMENT,
                    }}>
                    <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                        <Grid cols={{ base: 1, lg: 3 }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                            
                            {/* WARMUP */}
                            <Box 
                                padding={STORE_TOKENS.SPACING.ELEMENT} 
                                bg={STORE_TOKENS.COLORS.SURFACE} 
                                bgOpacity={STORE_TOKENS.OPACITY.MEDIUM} 
                                rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                                border
                            >
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font
                                        variant="sub-tiny"
                                        uppercase
                                        weight="bold"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                        }}>Aquecimento</Font>
                                    <Separator opacity={STORE_TOKENS.OPACITY.SUBTLE} />
                                    <Grid cols={{ base: 3 }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font
                                                variant="sub-tiny"
                                                {...{
                                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                }}>Séries</Font>
                                            <Input
                                                type="number"
                                                value={item.warmup_sets}
                                                onChange={(e: any) => onUpdate(item.id, { warmup_sets: parseInt(e.target.value) || 0 })}
                                                onBlur={(e: any) => { if (!e.target.value) onUpdate(item.id, { warmup_sets: 0 }) }}
                                                textAlign="center"
                                            />
                                        </Stack>
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font
                                                variant="sub-tiny"
                                                {...{
                                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                }}>Reps</Font>
                                            <Input
                                                defaultValue={item.warmup_reps}
                                                onBlur={(e: any) => onUpdate(item.id, { warmup_reps: e.target.value })}
                                                textAlign="center"
                                                placeholder="Reps"
                                            />
                                        </Stack>
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font
                                                variant="sub-tiny"
                                                {...{
                                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                }}>Desc (s)</Font>
                                            <Input
                                                type="number"
                                                defaultValue={item.warmup_rest_seconds}
                                                onBlur={(e: any) => onUpdate(item.id, { warmup_rest_seconds: parseInt(e.target.value) || 0 })}
                                                textAlign="center"
                                            />
                                        </Stack>
                                    </Grid>
                                </Stack>
                            </Box>

                            {/* FEEDER */}
                            <Box 
                                padding={STORE_TOKENS.SPACING.ELEMENT} 
                                bg={STORE_TOKENS.COLORS.SURFACE} 
                                bgOpacity={STORE_TOKENS.OPACITY.MEDIUM} 
                                rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                                border
                            >
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font
                                        variant="sub-tiny"
                                        uppercase
                                        weight="bold"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                        }}>Preparação (Feeder)</Font>
                                    <Separator opacity={STORE_TOKENS.OPACITY.SUBTLE} />
                                    <Grid cols={{ base: 3 }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font
                                                variant="sub-tiny"
                                                {...{
                                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                }}>Séries</Font>
                                            <Input
                                                type="number"
                                                value={item.feeder_sets}
                                                onChange={(e: any) => onUpdate(item.id, { feeder_sets: parseInt(e.target.value) || 0 })}
                                                onBlur={(e: any) => { if (!e.target.value) onUpdate(item.id, { feeder_sets: 0 }) }}
                                                textAlign="center"
                                            />
                                        </Stack>
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font
                                                variant="sub-tiny"
                                                {...{
                                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                }}>Reps</Font>
                                            <Input
                                                defaultValue={item.feeder_reps}
                                                onBlur={(e: any) => onUpdate(item.id, { feeder_reps: e.target.value })}
                                                textAlign="center"
                                                placeholder="Reps"
                                            />
                                        </Stack>
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font
                                                variant="sub-tiny"
                                                {...{
                                                    color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                                }}>Desc (s)</Font>
                                            <Input
                                                type="number"
                                                defaultValue={item.feeder_rest_seconds}
                                                onBlur={(e: any) => onUpdate(item.id, { feeder_rest_seconds: parseInt(e.target.value) || 0 })}
                                                textAlign="center"
                                            />
                                        </Stack>
                                    </Grid>
                                </Stack>
                            </Box>

                            {/* WORKING */}
                            <Box 
                                padding={STORE_TOKENS.SPACING.ELEMENT} 
                                bg={STORE_TOKENS.COLORS.INFO} 
                                bgOpacity={STORE_TOKENS.OPACITY.LOW} 
                                rounded={STORE_TOKENS.RADIUS.SYSTEM} 
                                border 
                                borderColor={STORE_TOKENS.COLORS.INFO} 
                                borderOpacity={STORE_TOKENS.OPACITY.MEDIUM}
                            >
                                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                    <Font
                                        variant="sub-tiny"
                                        uppercase
                                        weight="bold"
                                        {...{
                                            color: STORE_TOKENS.COLORS.INFO,
                                        }}>Séries Validadas</Font>
                                    <Separator opacity={STORE_TOKENS.OPACITY.SUBTLE} />
                                    <Grid cols={{ base: 3 }} gap={STORE_TOKENS.SPACING.ELEMENT}>
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font
                                                variant="sub-tiny"
                                                opacity={STORE_TOKENS.OPACITY.MODAL}
                                                {...{
                                                    color: STORE_TOKENS.COLORS.INFO,
                                                }}>Séries</Font>
                                            <Input
                                                type="number"
                                                value={item.working_sets}
                                                onChange={(e: any) => onUpdate(item.id, { working_sets: parseInt(e.target.value) || 0 })}
                                                onBlur={(e: any) => { if (!e.target.value) onUpdate(item.id, { working_sets: 0 }) }}
                                                textAlign="center"
                                            />
                                        </Stack>
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font
                                                variant="sub-tiny"
                                                opacity={STORE_TOKENS.OPACITY.MODAL}
                                                {...{
                                                    color: STORE_TOKENS.COLORS.INFO,
                                                }}>Reps</Font>
                                            <Input
                                                value={item.working_reps}
                                                onChange={(e: any) => onUpdate(item.id, { working_reps: e.target.value })}
                                                placeholder="Ex: 8-10"
                                            />
                                        </Stack>
                                        <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                            <Font
                                                variant="sub-tiny"
                                                opacity={STORE_TOKENS.OPACITY.MODAL}
                                                {...{
                                                    color: STORE_TOKENS.COLORS.INFO,
                                                }}>Desc (s)</Font>
                                            <Input
                                                type="number"
                                                defaultValue={item.rest_seconds}
                                                onBlur={(e: any) => onUpdate(item.id, { rest_seconds: parseInt(e.target.value) || 0 })}
                                                textAlign="center"
                                            />
                                        </Stack>
                                    </Grid>
                                </Stack>
                            </Box>
                        </Grid>
                        {/* NOTES SECTION */}
                        <GlassPanel border="subtle">
                            <CardHeader
                                {...{
                                    padding: STORE_TOKENS.PADDING.ELEMENT,
                                }}>
                                <Stack gap={STORE_TOKENS.SPACING.TINY}>
                                    <Font
                                        variant="sub-tiny"
                                        weight="bold"
                                        uppercase
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                        }}>Orientações e Observações Técnicas</Font>
                                    <Font
                                        variant="tiny"
                                        {...{
                                            color: STORE_TOKENS.COLORS.TEXT.MUTED,
                                        }}>Salva automaticamente ao sair do campo</Font>
                                </Stack>
                            </CardHeader>
                            <CardContent
                                {...{
                                    padding: STORE_TOKENS.PADDING.NONE,
                                }}>
                                {/* EXCEPTION: Manual overrides to make embedded textarea seamless inside the card */}
                                <Textarea
                                    defaultValue={item.notes}
                                    onBlur={(e) => onUpdate(item.id, { notes: e.target.value })}
                                    placeholder="Ex: Focar na contração lenta, 2s de isometria no pico..."
                                    {...{
                                        rounded: "none",
                                        className: "border-0 bg-transparent min-h-[80px]",
                                    }} />
                            </CardContent>
                        </GlassPanel>
                    </Stack>
                </CardContent>
            </GlassPanel>
        </Box>
    );
}
