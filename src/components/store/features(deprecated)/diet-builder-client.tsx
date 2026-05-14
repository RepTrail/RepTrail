'use client'

import dynamic from "next/dynamic"

export const DietBuilderClient = dynamic(
    () => import("./diet-builder").then(mod => ({ default: mod.DietBuilder })),
    { ssr: false }
) as React.ComponentType<{ diet: any; students?: any[]; backHref?: string }>
