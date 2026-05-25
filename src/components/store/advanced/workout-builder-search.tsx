'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { Input } from '@/components/store/base/input'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { GlassPanel, Card, Surface } from '@/components/store/base/surface'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { PlusCircle, Search, Plus } from 'lucide-react'


interface WorkoutBuilderSearchProps {
    searchQuery: string
    isSearching: boolean
    searchResults: any[]
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
    onAddExercise: (ex: any) => void
    onAddCustom: () => void
}

export function WorkoutBuilderSearch({
    searchQuery,
    isSearching,
    searchResults,
    onSearch,
    onAddExercise,
    onAddCustom
}: WorkoutBuilderSearchProps) {
    return (
        <GlassPanel 
            padding={STORE_TOKENS.SPACING.CONTAINER} 
            border="subtle"
            position="relative"
            zIndex={searchResults.length > 0 ? 50 : undefined}
        >
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <InlineWrapper>
                    <Icon icon={PlusCircle} size="sm" color={STORE_TOKENS.COLORS.INFO} />
                    <Font variant="heading" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase>
                        Adicionar Exercício
                    </Font>
                </InlineWrapper>

                {/* Relative container around input to position the dropdown overlay */}
                <Box position="relative" width="full" zIndex={searchResults.length > 0 ? 50 : 'auto'}>
                    <Input
                        icon={<Icon icon={Search} size="sm" />}
                        placeholder="Busque por exercícios (ex: Supino, Agachamento...)"
                        value={searchQuery}
                        onChange={onSearch}
                        size="lg"
                    />

                    {/* Standard absolute Card dropdown matching FormSelect exactly */}
                    {searchResults.length > 0 && (
                        <Card 
                            position="absolute" 
                            top="calc(100% + 4px)" 
                            left={0} 
                            right={0} 
                            zIndex={50} 
                            border="subtle"
                            padding={STORE_TOKENS.PADDING.NONE}
                            overflow="auto"
                        >
                            <Stack gap={STORE_TOKENS.SPACING.NONE}>
                                {searchResults.map((ex) => (
                                    <Box
                                        key={ex.id}
                                        as="button"
                                        type="button"
                                        onClick={() => onAddExercise(ex)}
                                        display="flex"
                                        align="center"
                                        justify="between"
                                        fullWidth
                                        padding={STORE_TOKENS.PADDING.ELEMENT}
                                        transition
                                        hoverBg="white"
                                        hoverBgOpacity={5}
                                        cursor="pointer"
                                    >
                                        <Stack direction="col" gap="element" align="start">
                                            <Font variant="label-caps" color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>
                                                {ex.name}
                                            </Font>
                                            <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.DIM}>
                                                {ex.is_system_default ? 'BIBLIOTECA' : 'PERSONALIZADO'}
                                            </Font>
                                        </Stack>
                                        <Icon icon={Plus} size="xs" color="zinc-500" />
                                    </Box>
                                ))}
                            </Stack>
                        </Card>
                    )}
                </Box>

                {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                    <Surface 
                        variant="sunken" 
                        padding={STORE_TOKENS.PADDING.CONTAINER} 
                        rounded="system" 
                        border="subtle"
                    >
                        <Stack direction={{ base: 'col', md: 'row' }} align={{ base: 'stretch', md: 'center' }} justify="between" gap={STORE_TOKENS.SPACING.ELEMENT}>
                            <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
                                "{<Font variant="body" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} weight="bold">{searchQuery}</Font>}" não encontrado na biblioteca.
                            </Font>
                            <Button
                                variant="outline-blue"
                                onClick={onAddCustom}
                                shrink={0}
                                size="sm"
                            >
                                <Icon icon={Plus} size="xs" color="blue" />
                                <span>Criar Novo Exercício</span>
                            </Button>
                        </Stack>
                    </Surface>
                )}
            </Stack>
        </GlassPanel>
    )
}

// Inline helper wrapping component conforming to design rules
function InlineWrapper({ children }: { children: React.ReactNode }) {
    return (
        <Box display="flex" align="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
            {children}
        </Box>
    )
}
