import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import WorkoutPlayerClient from './workout-player-client'

export default async function WorkoutPlayerPage({ 
    params,
    searchParams
}: { 
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { id: workoutId } = await params
    const sParams = await searchParams
    const isForced = sParams.force === 'true'
    
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')
    
    return <WorkoutPlayerClient userId={userId} workoutId={workoutId} isForced={isForced} />
}
