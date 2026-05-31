import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { StudentDietDailyClient } from './diet-daily-client'

export default async function StudentDietPage() {
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    return <StudentDietDailyClient userId={userId} />
}
