'use client'

import dynamic from "next/dynamic"

export const DietBuilderClient = dynamic(
    () => import("@/components/feature/trainer/diet-builder").then(mod => ({ default: mod.DietBuilder })),
    { ssr: false }
) as React.ComponentType<{ diet: any; students?: any[]; backHref?: string }>
