import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { LastSeenTracker } from '@/components/layout/last-seen-tracker'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    return (
        <div className="min-h-screen w-full bg-zinc-950">
            <LastSeenTracker />
            {children}
        </div>
    )
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 pb-4 py-3 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all duration-200 group"
        >
            <span className="group-hover:text-white transition-colors text-zinc-500">{icon}</span>
            <span className="font-medium">{children}</span>
        </Link>
    )
}

function MobileNavLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="p-3 text-zinc-500 hover:text-white transition-colors"
        >
            {icon}
        </Link>
    )
}
