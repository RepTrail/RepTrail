import { getCardioDetails } from '@/actions/cardio-actions'
import { CardioBuilder } from '@/components/feature/trainer/cardio-builder'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

interface Props {
    params: Promise<{ id: string }>
}

export default async function StudentCardioDetailPage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return notFound()

    const { data: profile } = await supabase
        .from('profiles')
        .select('auto_training_status')
        .eq('id', user.id)
        .single()

    const isAutoTrainingActive = profile?.auto_training_status === 'active' || profile?.auto_training_status === 'trial'
    if (!isAutoTrainingActive) return notFound()

    const cardio = await getCardioDetails(id)
    if (!cardio || cardio.trainer_id !== user.id) return notFound()

    return (
        <div className="max-w-3xl mx-auto py-6  space-y-8">
            <CardioBuilder cardio={cardio as any} backHref="/dashboard/student/cardio" />
        </div>
    )
}
