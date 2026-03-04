'use client'

import { usePathname } from 'next/navigation'
import { MobileStudentNav } from './student-nav'

interface ConditionalMobileNavProps {
    hasTrainer: boolean
    steroidUse?: boolean
    autoTrainingActive?: boolean
}

export function ConditionalMobileNav(props: ConditionalMobileNavProps) {
    const pathname = usePathname()

    // Hide nav on review page and potentially other critical focus pages
    const isReviewPage = pathname.includes('/review')

    if (isReviewPage) return null

    return (
        <div className="md:hidden fixed bottom-6 left-6 right-6 z-40">
            <MobileStudentNav {...props} />
        </div>
    )
}
