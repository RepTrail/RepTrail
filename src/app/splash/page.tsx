'use client'

import { SplashScreen } from "@/components/store/advanced/splash-screen"
import { Box } from "@/components/store/base/box"

export default function SplashPage() {
    return (
        <Box as="main" minHeight="screen" bg="black" overflow="hidden" position="relative" suppressHydrationWarning>
            <SplashScreen redirectHref="/" />
        </Box>
    )
}
