import { getAffiliateData } from '@/actions/affiliate-actions'
import { redirect } from 'next/navigation'
import { AffiliateClientDashboard } from '@/components/feature/affiliate/affiliate-client-dashboard'
import { AffiliateMetaPixel } from './meta-pixel'

export default async function AffiliateDashboard() {
    const data = await getAffiliateData()

    if (!data) {
        redirect('/auth/login')
    }

    return (
        <>
            <AffiliateMetaPixel />
            <AffiliateClientDashboard data={data} />
        </>
    )
}
