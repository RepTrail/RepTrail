import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { StudentDietDetailClient } from './diet-detail-client'

export default async function StudentDietEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    return <StudentDietDetailClient id={id} userId={userId} />
}
