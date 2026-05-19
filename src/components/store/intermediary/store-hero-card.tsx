'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Icon } from '@/components/store/base/icon'
import { Box } from '@/components/store/base/box'
import { Banner } from '@/components/store/base/banner'
import { ArrowRight } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function StoreHeroCard() {
    return (
        <Banner src="/imagem-loja.png">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align={{ base: 'center', md: 'start' }} fullWidth>
                    <Box textAlign={{ base: 'center', md: 'left' }}>
                        <Font
                            variant="hero"
                            color={STORE_TOKENS.COLORS.TEXT.PRIMARY}
                        >
                            PERFORMANCE
                        </Font>
                        <br />
                        <Font
                            variant="hero"
                            color="orange"
                        >
                            EXTREMA
                        </Font>
                    </Box>
                    <Box maxWidth="md" textAlign={{ base: 'center', md: 'left' }}>
                        <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} weight="medium">
                            A base sólida que seu corpo precisa para bater novos recordes todos os dias.
                        </Font>
                    </Box>
                </Stack>

            </Stack>
        </Banner>
    );
}
