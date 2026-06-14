'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import React from 'react'
import { EmptyState404 } from '@/components/store/intermediary/empty-state-404'
import { Box } from '@/components/store/base/box'

export default function NotFound() {
  return (
    <Box as="main" minHeight="screen" bg={STORE_TOKENS.COLORS.BACKGROUND} overflow="hidden">
      <EmptyState404 />
    </Box>
  );
}
