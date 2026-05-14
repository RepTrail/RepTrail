'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AIProtocolGenerator } from './ai-protocol-generator'
import { Sparkles, Dumbbell, Utensils, Zap, X, Store } from 'lucide-react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function AIProtocolEmptyState({ userId }: { userId: string }) {
    const [showForm, setShowForm] = useState(false)

    if (showForm) {
        return (
            <Box 
                position="relative" 
                bg="zinc" 
                bgOpacity={60} 
                border 
                borderColor="zinc" 
                rounded="system" 
                padding={STORE_TOKENS.SPACING.CONTAINER}
            >
                <Box 
                    position="absolute" 
                    pin="inset" 
                    className="bg-gradient-to-br from-orange-500/5 via-transparent to-transparent pointer-events-none" 
                />

                <Stack gap={STORE_TOKENS.SPACING.CONTAINER} className="relative">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Box 
                                width={10} 
                                height={10} 
                                bg="orange" 
                                bgOpacity={10} 
                                border 
                                borderColor="orange" 
                                rounded="system" 
                                className="flex items-center justify-center"
                            >
                                <Sparkles className="w-5 h-5 text-orange-400" />
                            </Box>
                            <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                                <Font variant="tiny" weight="black" italic uppercase tracking="tight" color="white">
                                    Protocolo com IA
                                </Font>
                                <Font variant="sub-tiny" weight="black" color="zinc-500" uppercase tracking="widest">
                                    Personalizado para você
                                </Font>
                            </Stack>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowForm(false)}
                            className="text-zinc-600 hover:text-white rounded-system hover:bg-zinc-800 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    <AIProtocolGenerator userId={userId} />
                </Stack>
            </Box>
        )
    }

    return (
        <Box 
            position="relative" 
            bg="zinc" 
            bgOpacity={50} 
            border 
            borderColor="zinc" 
            rounded="system" 
            padding={{ base: STORE_TOKENS.PADDING.CONTAINER, md: STORE_TOKENS.PADDING.CONTAINER }} 
            className="text-center group overflow-hidden"
        >
            <Box 
                position="absolute" 
                pin="inset" 
                opacity={0} 
                groupHoverOpacity={100} 
                transition 
                className="bg-gradient-to-br from-orange-500/10 via-transparent to-transparent pointer-events-none" 
            />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" className="relative z-10 max-w-lg mx-auto">
                <Box position="relative" width={96} height={96}>
                    <Box 
                        position="absolute" 
                        pin="inset" 
                        bg="orange" 
                        bgOpacity={10} 
                        rounded="system" 
                        border 
                        borderColor="orange" 
                        className="flex items-center justify-center"
                    >
                        <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-orange-400/80" />
                    </Box>
                    <Box 
                        position="absolute" 
                        bottom={-2} 
                        left={-2} 
                        width={9} 
                        height={9} 
                        bg="zinc" 
                        bgOpacity={95} 
                        border 
                        borderColor="zinc" 
                        rounded="system" 
                        className="flex items-center justify-center"
                    >
                        <Dumbbell className="w-4 h-4 text-zinc-400" />
                    </Box>
                    <Box 
                        position="absolute" 
                        bottom={-2} 
                        right={-2} 
                        width={9} 
                        height={9} 
                        bg="zinc" 
                        bgOpacity={95} 
                        border 
                        borderColor="zinc" 
                        rounded="system" 
                        className="flex items-center justify-center"
                    >
                        <Utensils className="w-4 h-4 text-zinc-400" />
                    </Box>
                </Box>

                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Font variant="h2" weight="black" italic uppercase tracking="tight" color="white" className="text-2xl md:text-4xl leading-tight">
                        Você ainda não tem <br />
                        <Font color="orange">um protocolo ativo</Font>
                    </Font>
                    <Font variant="sub-tiny" weight="bold" color="zinc-400" className="max-w-sm mx-auto leading-relaxed">
                        Deixa a IA montar seu treino, cardio e dieta do zero — 100% personalizado com base no seu perfil e preferências.
                    </Font>
                </Stack>

                <div className="flex flex-wrap justify-center gap-2">
                    {['Treino', 'Cardio', 'Dieta', 'Macros'].map(f => (
                        <Box 
                            key={f} 
                            padding={STORE_TOKENS.PADDING.CONTAINER} 
                            bg="zinc" 
                            bgOpacity={95} 
                            border 
                            borderColor="zinc" 
                            rounded="system" 
                            className="flex items-center gap-1.5"
                        >
                            <Zap className="w-2.5 h-2.5 text-orange-500" />
                            <Font variant="sub-tiny" weight="black" color="zinc-400" uppercase tracking="widest">
                                {f}
                            </Font>
                        </Box>
                    ))}
                </div>

                <Button
                    onClick={() => setShowForm(true)}
                    className="min-h-14 h-auto py-4 px-8 rounded-system bg-gradient-to-r from-orange-600 to-orange-400 hover:from-orange-500 hover:to-orange-300 text-zinc-950 font-black uppercase italic tracking-wide transition-all shadow-2xl shadow-orange-500/30 text-base md:text-lg active:scale-95 leading-tight"
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    <span>Gerar Protocolo com IA</span>
                </Button>

                <Font variant="sub-tiny" weight="black" color="zinc-600" uppercase tracking="widest">
                    Gratuito · Leva menos de 2 minutos
                </Font>
            </Stack>
        </Box>
    );
}

