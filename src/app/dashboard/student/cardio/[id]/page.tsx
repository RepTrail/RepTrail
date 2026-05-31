import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { StudentCardioDetailClient } from './cardio-detail-client'

interface Props {
    params: Promise<{ id: string }>
}

export default async function StudentCardioDetailPage({ params }: Props) {
    const { id } = await params

    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    return <StudentCardioDetailClient id={id} userId={userId} />
}
