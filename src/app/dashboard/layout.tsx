import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { LastSeenTracker } from '@/components/layout/last-seen-tracker'
import { Box } from '@/components/store/base/box'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    return (
        <Box minHeight="screen" width="full" bg="zinc">
            <LastSeenTracker />
            {children}
        </Box>
    )
}
