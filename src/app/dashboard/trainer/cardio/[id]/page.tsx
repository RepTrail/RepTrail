import { getCardioDetails } from '@/actions/cardio-actions'
import { getTrainerStudents } from '@/actions/trainer-actions'
import { CardioBuilder } from '@/components/store/features(deprecated)/cardio-builder'
import { notFound } from 'next/navigation'

interface Props {
    params: { id: string }
}

export default async function CardioDetailPage({ params }: Props) {
    const { id } = await params
    const [cardio, students] = await Promise.all([
        getCardioDetails(id),
        getTrainerStudents()
    ])

    if (!cardio) notFound()

    return (
        <div className="max-w-3xl mx-auto py-6  space-y-8">
            <CardioBuilder cardio={cardio} students={students} />
        </div>
    )
}
