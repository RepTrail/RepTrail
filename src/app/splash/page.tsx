'use client';
import { STORE_TOKENS } from '@/components/store/constants/tokens';

import { SplashScreen } from "@/components/store/advanced/splash-screen"
import { Box } from "@/components/store/base/box"

export default function SplashPage() {
    return (
        <Box as="main" minHeight="screen" bg={STORE_TOKENS.COLORS.BLACK} overflow="hidden" position="relative" suppressHydrationWarning>
            <SplashScreen redirectHref="/" />
        </Box>
    );
}
