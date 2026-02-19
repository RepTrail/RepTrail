import { getAffiliateData } from '@/actions/affiliate-actions'
import { redirect } from 'next/navigation'
import { AffiliateClientDashboard } from '@/components/feature/affiliate/affiliate-client-dashboard'

export default async function AffiliateDashboard() {
    const data = await getAffiliateData()

    if (!data) {
        redirect('/auth/login')
    }

    return <AffiliateClientDashboard data={data} />
}
