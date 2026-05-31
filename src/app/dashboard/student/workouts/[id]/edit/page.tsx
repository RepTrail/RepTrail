import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { EditWorkoutClient } from "./edit-workout-client"

export default async function EditStudentWorkoutPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const headerList = await headers()
    const userId = headerList.get('x-user-id')
    if (!userId) redirect('/auth/login')

    return <EditWorkoutClient id={id} userId={userId} />
}
