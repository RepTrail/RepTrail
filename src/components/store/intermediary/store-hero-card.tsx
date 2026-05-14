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
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Box>
                        <Font
                            variant="display"
                            color={STORE_TOKENS.COLORS.TEXT.PRIMARY}
                        >
                            PERFORMANCE
                        </Font>
                        <br />
                        <Font
                            variant="massive"
                            color="orange"
                        >
                            EXTREMA
                        </Font>
                    </Box>
                    <Box maxWidth="md">
                        <Font variant="body" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} weight="medium">
                            A base sólida que seu corpo precisa para bater novos recordes todos os dias.
                        </Font>
                    </Box>
                </Stack>

                <Box width="auto" alignSelf="start">
                    <Button variant="orange" size="lg" rounded={STORE_TOKENS.RADIUS.SYSTEM} textColor="black" direction="row" gap={STORE_TOKENS.SPACING.ELEMENT}>
                        <Font {...STORE_TOKENS.TYPOGRAPHY.HEADING} variant="body-sm">EXPLORAR COLEÇÃO</Font>
                        <Icon icon={ArrowRight} size="sm" color={STORE_TOKENS.COLORS.BLACK} />
                    </Button>
                </Box>
            </Stack>
        </Banner>
    );
}
