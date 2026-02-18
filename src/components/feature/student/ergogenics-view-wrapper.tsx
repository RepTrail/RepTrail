'use client'

import dynamic from 'next/dynamic'

const StudentErgogenicsView = dynamic(
    () => import('./ergogenics-view').then(mod => ({ default: mod.StudentErgogenicsView })),
    { 
        ssr: false, 
        loading: () => <div className="py-20 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest">Carregando protocolo...</div> 
    }
)

interface StudentErgogenicsViewWrapperProps {
    studentId: string
    ergogenics: any[]
    initialLogs: any[]
}

export function StudentErgogenicsViewWrapper({ studentId, ergogenics, initialLogs }: StudentErgogenicsViewWrapperProps) {
    return (
        <StudentErgogenicsView
            studentId={studentId}
            ergogenics={ergogenics}
            initialLogs={initialLogs}
        />
    )
}
