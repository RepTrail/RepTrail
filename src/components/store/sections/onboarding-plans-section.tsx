'use client'

import React from 'react'
import { TrainerPlansSection } from '@/components/store/sections/trainer-plans-section'

interface OnboardingPlansSectionProps {
    plans: any[]
}

export function OnboardingPlansSection({ plans }: OnboardingPlansSectionProps) {
    return <TrainerPlansSection plans={plans} />
}
