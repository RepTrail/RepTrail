import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { LastSeenTracker } from '@/components/store/providers/last-seen-tracker'
import { Box } from '@/components/store/base/box'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    const { getProfile } = await import('@/lib/dal/server')
    const profile = await getProfile(userId)
    if (!profile) {
        redirect('/auth/logout')
    }

    return (
        <Box minHeight="screen" width="full" bg={STORE_TOKENS.COLORS.BACKGROUND}>
            <LastSeenTracker />
            {children}
        </Box>
    );
}
