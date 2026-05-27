'use client'

import React from 'react'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Inline } from '@/components/store/base/layout'
import { Box } from '@/components/store/base/box'
import { GlassPanel, CardHeader, CardContent } from '@/components/store/base/surface'
import { RegistrySection } from '@/components/store/advanced/registry-section'
import { Layout } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function LayoutSpacingContent({ id }: { id?: string }) {
  return (
      <RegistrySection
          id={id}
          title="Layout & Espaçamento"
          icon={Layout}
          subtitle="Regras de arquitetura de layout, raios de borda e padding obrigatório."
      >
          {/* Radii & Padding Rules */}
          <GlassPanel padding="none">
              <Stack gap="none">
                  <CardHeader>
                      <Font weight="bold">Radii & Base Padding</Font>
                  </CardHeader>
                  <CardContent
                      {...{
                          padding: STORE_TOKENS.PADDING.CONTAINER,
                      }}>
                      <Stack direction={{ base: 'col', md: 'row' }} gap={STORE_TOKENS.SPACING.CONTAINER} align="stretch">
                          <Box flex1 display="flex" align="center" justify="center">
                              <Inline gap={STORE_TOKENS.SPACING.CONTAINER} justify="center" fullWidth>
                                  <RadiusItem
                                      label="Standard"
                                      value="5px"
                                      {...{
                                          rounded: STORE_TOKENS.RADIUS.SYSTEM,
                                      }} />
                                  <RadiusItem
                                      label="Pills"
                                      value="Full"
                                      {...{
                                          rounded: STORE_TOKENS.RADIUS.FULL,
                                      }} />
                              </Inline>
                          </Box>

                          <GlassPanel flex1 padding={STORE_TOKENS.PADDING.CONTAINER} width={{ base: 'full', md: 'half' }}>
                              <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                                  <Font
                                      variant="sub-tiny"
                                      weight="black"
                                      uppercase
                                      italic
                                      tracking="widest"
                                      {...{
                                          color: "orange",
                                      }}>Governance Rules:</Font>
                                  <Font
                                      variant="description"
                                      {...{
                                          color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                      }}>1. Radius must be strictly [5px] or [Full].</Font>
                                  <Font
                                      variant="description"
                                      {...{
                                          color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                      }}>2. Mandatory Card Padding is [20px] (Orange).</Font>
                                  <Font
                                      variant="description"
                                      {...{
                                          color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                      }}>3. Margins (mt/mb) are strictly prohibited.</Font>
                              </Stack>
                          </GlassPanel>
                      </Stack>
                  </CardContent>
              </Stack>
          </GlassPanel>
      </RegistrySection>
  );
}

interface RadiusItemProps {
  label: string
  value: string
  rounded: 'system' | 'full' | 'none'
}

function RadiusItem({ label, value, rounded }: RadiusItemProps) {
  return (
      <Box bg="orange" padding={STORE_TOKENS.PADDING.CONTAINER} flex1 rounded={rounded}>
          <Stack align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT}>
            <Font
                weight="black"
                variant="sub-tiny"
                uppercase
                italic
                {...{
                    color: STORE_TOKENS.COLORS.BLACK,
                }}>{label}</Font>
            <Font
                weight="bold"
                variant="body"
                {...{
                    color: STORE_TOKENS.COLORS.BLACK,
                }}>{value}</Font>
          </Stack>
      </Box>
  );
}
