import { deleteStudentWorkout } from '@/actions/student-content-actions'
import { NextResponse } from 'next/server'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        console.log('[API] Delete workout request:', { id })
        
        if (!id) {
            return NextResponse.json({ error: 'Workout ID is required' }, { status: 400 })
        }

        /* ❌ OUTBOX VIOLATION */ await deleteStudentWorkout(id)
        return NextResponse.redirect(new URL('/dashboard/student/workouts', request.url))
    } catch (error: any) {
        console.error('[API] Delete workout error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
