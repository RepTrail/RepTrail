import { useQuery } from '@tanstack/react-query'
import { useAuthUser } from './hooks'
import { localGet } from './localDb'

export function getPlanLimitsDetails(plan_tier?: string | null) {
    const defaultLimits = {
        plan: 'Básico',
        features: {
            hasAdvancedAnalytics: false,
            hasCustomBranding: false,
            hasEliteBadge: false,
            hasStore: true,
            hasRanking: true,
        },
        quotas: {
            maxPhotosPerStudent: 2,
            currentCycleStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
        }
    }

    if (!plan_tier) return defaultLimits

    if (plan_tier.toLowerCase().includes('pro') || plan_tier.toLowerCase().includes('premium')) {
        defaultLimits.plan = 'PRO'
        defaultLimits.features.hasAdvancedAnalytics = true
        defaultLimits.features.hasEliteBadge = true
        defaultLimits.features.hasCustomBranding = true
        defaultLimits.quotas.maxPhotosPerStudent = 4
    }

    if (plan_tier.toLowerCase().includes('elite')) {
        defaultLimits.plan = 'Elite'
        defaultLimits.features.hasAdvancedAnalytics = true
        defaultLimits.features.hasEliteBadge = true
        defaultLimits.features.hasCustomBranding = true
        defaultLimits.quotas.maxPhotosPerStudent = 10
    }

    return defaultLimits
}

export function usePlanLimits() {
    const { data: authUser } = useAuthUser()

    return useQuery({
        queryKey: ['plan-limits', authUser?.id],
        queryFn: async () => {
            if (!authUser) return null
            return getPlanLimitsDetails(authUser.plan_tier)
        },
        staleTime: 1000 * 60 * 15, // 15 mins
        enabled: !!authUser,
    })
}
