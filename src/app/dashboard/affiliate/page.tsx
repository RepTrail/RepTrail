import { actions } from '@/lib/dal'
import { redirect } from 'next/navigation'
import { AffiliateDashboardClient } from './affiliate-dashboard-client'
import { AffiliateMetaPixel } from './meta-pixel'

/**
 * AffiliateDashboard Page: Standardized following the Store/Advanced/Sections architecture.
 * Now a Server Component to support async data fetching.
 */
export default async function AffiliateDashboard() {
    const data = await actions.getAffiliateData()

    if (!data) {
        redirect('/auth/login')
    }

    return (
        <>
            <AffiliateMetaPixel />
            <AffiliateDashboardClient data={data} />
        </>
    )
}
