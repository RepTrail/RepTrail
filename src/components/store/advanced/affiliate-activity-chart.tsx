'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useRegistry } from '@/components/store/base/registry-context'

interface AffiliateActivityChartProps {
  clickDays: [string, number][]
  maxClicks: number
}

export function AffiliateActivityChart({ clickDays, maxClicks }: AffiliateActivityChartProps) {
  const { primaryColor } = useRegistry()

  // Last 14 days for the chart
  const recentDays = clickDays.slice(-14)

  return (
    <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
      <Box 
        height="160px" 
        fullWidth 
        display="flex" 
        align="end" 
        justify="between" 
        padding={STORE_TOKENS.PADDING.ELEMENT}
      >
        {recentDays.map(([date, count], i) => {
          const heightPercent = (count / maxClicks) * 100
          const isToday = i === recentDays.length - 1

          return (
            <Stack key={date} align="center" gap={STORE_TOKENS.SPACING.ELEMENT} flex1>
              <Box 
                fullWidth 
                bg={isToday ? primaryColor as any : STORE_TOKENS.COLORS.BACKGROUND} 
                bgOpacity={isToday ? STORE_TOKENS.OPACITY.FULL : STORE_TOKENS.OPACITY.MEDIUM}
                rounded={STORE_TOKENS.RADIUS.SYSTEM}
                height={`${Math.max(heightPercent, 5)}%`}
                transition
                hoverBgOpacity={STORE_TOKENS.OPACITY.SHELF}
                cursor="pointer"
                group
                position="relative"
              >
                {/* Tooltip */}
                <Box 
                  position="absolute" 
                  top="-30px" 
                  left="50%" 
                  translateX="-full"
                  bg={STORE_TOKENS.COLORS.BLACK} 
                  padding={STORE_TOKENS.PADDING.ELEMENT} 
                  rounded={STORE_TOKENS.RADIUS.NONE} 
                  display="none" 
                  groupHoverDisplay="block"
                  zIndex={STORE_TOKENS.Z_INDEX.OVERLAY}
                >
                   <Font
                     variant="sub-tiny"
                     weight="black"
                     nowrap
                     {...{
                       color: "white",
                     }}>{count} cliques</Font>
                </Box>
              </Box>
            </Stack>
          );
        })}
      </Box>
      {/* X-Axis Labels */}
      <Box display="flex" justify="between" fullWidth padding={STORE_TOKENS.PADDING.ELEMENT}>
        <Font
          variant="sub-tiny"
          {...{
            color: STORE_TOKENS.COLORS.TEXT.MUTED,
          }}>
          {recentDays[0]?.[0]}
        </Font>
        <Font
          variant="sub-tiny"
          {...{
            color: STORE_TOKENS.COLORS.TEXT.MUTED,
          }}>
          Hoje
        </Font>
      </Box>
    </Stack>
  );
}
