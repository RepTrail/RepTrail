import { getCardioDetails } from '@/actions/cardio-actions'
import { CardioBuilder } from '@/components/feature/trainer/cardio-builder'
import { notFound } from 'next/navigation'

interface Props {
    params: { id: string }
}

export default async function CardioDetailPage({ params }: Props) {
    const { id } = await params
    const cardio = await getCardioDetails(id)
    if (!cardio) notFound()

    return (
        <div className="max-w-3xl mx-auto py-6 px-4 space-y-8">
            <CardioBuilder cardio={cardio} />
        </div>
    )
}
