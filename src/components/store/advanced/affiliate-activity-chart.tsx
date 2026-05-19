'use client'

import React from 'react'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'
import { useRegistry } from '@/components/store/advanced/registry-context'

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
        height={160} 
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
            <Stack key={date} align="center" gap={2.5} flex1>
              <Box 
                fullWidth 
                bg={isToday ? primaryColor as any : 'zinc'} 
                bgOpacity={isToday ? 100 : 20}
                rounded="system"
                style={{ height: `${Math.max(heightPercent, 5)}%` }}
                transition
                hoverBgOpacity={80}
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
                  bg="black" 
                  padding={2.5} 
                  rounded="none" 
                  display="none" 
                  groupHoverDisplay="block"
                  zIndex={50}
                >
                   <Font variant="sub-tiny" color="white" weight="black" nowrap>{count} cliques</Font>
                </Box>
              </Box>
            </Stack>
          )
        })}
      </Box>

      {/* X-Axis Labels */}
      <Box display="flex" justify="between" fullWidth padding={STORE_TOKENS.PADDING.ELEMENT}>
        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
          {recentDays[0]?.[0]}
        </Font>
        <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.MUTED}>
          Hoje
        </Font>
      </Box>
    </Stack>
  )
}
