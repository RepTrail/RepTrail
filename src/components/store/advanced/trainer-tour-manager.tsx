'use client'

import { usePathname } from 'next/navigation'
import { useTrainerOnboarding } from '@/hooks/use-trainer-onboarding'
import { SpotlightTour, TourStep } from '@/components/shared/spotlight-tour'
import { useMemo, useState, useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerProfile } from '@/actions/trainer-actions'

interface TrainerTourManagerProps {
    userId: string
}

export function TrainerTourManager({ userId }: TrainerTourManagerProps) {
    const pathname = usePathname()
    
    // 1. Core State Hooks
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [isDesktop, setIsDesktop] = useState(false)
    const [showBindingModes, setShowBindingModes] = useState(false)
    const [isCreatingStudent, setIsCreatingStudent] = useState(false)
    const [isParsed, setIsParsed] = useState(false)
    const [isImpersonating, setIsImpersonating] = useState(false)

    // 2. Data Hooks
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.profile.detail(userId),
        queryFn: () => getTrainerProfile()
    })

    const { step: onboardingStep, isTourActive, dismissTour, complete } = useTrainerOnboarding(userId, { 
        activeStudents: profile?.stats?.active_students || 0, 
        workoutsCount: 0, 
        dietsCount: 0 
    })

    // 3. Effect Hooks
    // Only run on desktop (>= 1024px)
    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 1024)
        check()
        window.addEventListener('resize', check)
        
        // Check impersonation status
        const cookies = document.cookie.split('; ')
        const imp = cookies.find(c => c.startsWith('rt_impersonating='))?.split('=')[1]
        setIsImpersonating(imp === 'true')

        return () => window.removeEventListener('resize', check)
    }, [])

    // RESET EFFECT: Reset tour index when significant state changes
    useEffect(() => {
        if (currentStepIndex !== 0) {
            setCurrentStepIndex(0)
        }
    }, [pathname, showBindingModes, isCreatingStudent, isParsed, onboardingStep])

    // UI MONITORING EFFECT
    useEffect(() => {
        if (pathname !== '/dashboard/trainer/import-pdf') return
        const check = () => {
            const btn = document.querySelector('#tour-btn-create-student')
            const fields = document.querySelector('#tour-student-fields')
            const parsed = document.querySelector('#tour-parsed-status')
            
            const hasBtn = !!btn
            const hasFields = !!fields
            const hasParsed = !!parsed

            if (hasBtn !== showBindingModes) setShowBindingModes(hasBtn)
            if (hasFields !== isCreatingStudent) setIsCreatingStudent(hasFields)
            if (hasParsed !== isParsed) setIsParsed(hasParsed)
        }
        const interval = setInterval(check, 500)
        return () => clearInterval(interval)
    }, [pathname, showBindingModes, isCreatingStudent, isParsed])

    // 4. Memoized Hooks
    const allSteps = useMemo(() => {
        const steps: (TourStep & { path: string, condition?: boolean })[] = [
            // PASSO 1: Dashboard
            {
                path: '/dashboard/trainer',
                selector: '#tour-import-pdf',
                title: 'Comece agora',
                content: 'Abra o importador inteligente para transformar seus PDFs em protocolos digitais em segundos.',
                position: 'right',
                condition: onboardingStep === 'import_diet'
            },
            // PASSO 2: Tipo de PDF
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-import-type',
                title: 'Defina o objetivo',
                content: 'Selecione se você vai digitalizar um treino ou uma dieta agora.',
                position: 'bottom',
                condition: onboardingStep === 'import_diet' && !isParsed,
                showNextButton: true
            },
            // PASSO 3: Upload
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-dropzone',
                title: 'Upload inteligente',
                content: 'Arraste o arquivo aqui. A gente lê e organiza tudo automaticamente.',
                position: 'top',
                condition: onboardingStep === 'import_diet' && !isParsed
            },
            // PASSO 4: Preencher Dados
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-student-fields',
                title: 'Identifique o aluno',
                content: 'Informe o nome e e-mail dele. Quando o aluno acessar, o plano já estará esperando por ele.',
                position: 'top',
                condition: onboardingStep === 'import_diet' && showBindingModes && isCreatingStudent,
                showNextButton: true,
                noPulse: true
            },
            // PASSO 5: Conferir (Alvo: Card de Importação)
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-import-card',
                title: 'Quase pronto',
                content: 'Revise os dados extraídos automaticamente. Se estiver tudo certo, confirme para salvar.',
                position: 'top-right',
                isFixed: true,
                condition: onboardingStep === 'import_diet' && showBindingModes && isCreatingStudent,
                noPulse: true,
                showArrow: true
            },
            // PASSO 6: Ir para Alunos (Sidebar)
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-sidebar-students',
                title: 'Plano pronto',
                content: 'Deu certo. Agora vamos ver como ele ficou na sua lista.',
                position: 'right',
                condition: onboardingStep === 'aha_moment'
            },
            // PASSO 7: Abrir Perfil (Lista de Alunos)
            {
                path: '/dashboard/trainer/students',
                selector: '#tour-view-profile-0',
                title: 'Tudo organizado',
                content: 'Veja como o aluno vai receber tudo pronto no perfil dele.',
                position: 'left',
                condition: onboardingStep === 'aha_moment'
            },
            // PASSO 8: AHA MOMENT (Perfil do Aluno)
            {
                path: '/dashboard/trainer/students/[id]', 
                selector: '#tour-aha-card',
                title: '🎉 Protocolo entregue',
                content: 'O plano já está no app. Agora é só o aluno entrar com o e-mail que você definiu para começar a treinar.\n\nVocê digitalizou seu primeiro plano em minutos. Agora sua consultoria está pronta para escalar.',
                position: 'center',
                condition: onboardingStep === 'aha_moment',
                showNextButton: true,
                nextButtonLabel: 'Finalizar',
                noPulse: true
            }
        ]

        return steps.filter(s => s.path === pathname || (s.path.includes('[id]') && pathname.includes('/students/')))
            .filter(s => s.condition === undefined || s.condition)
    }, [pathname, onboardingStep, showBindingModes, isCreatingStudent, isParsed])

    // Progress mapping
    const globalStepIndex = useMemo(() => {
        if (onboardingStep === 'aha_moment') {
            if (pathname.includes('/students/')) return 8;
            if (pathname === '/dashboard/trainer/students') return 7;
            return 6;
        }

        if (onboardingStep === 'import_diet') {
            if (pathname === '/dashboard/trainer') return 1;
            if (pathname === '/dashboard/trainer/import-pdf') {
                if (showBindingModes && isCreatingStudent) return 4 + currentStepIndex;
                if (isParsed) return 3;
                return 2 + currentStepIndex;
            }
        }

        return 1;
    }, [pathname, showBindingModes, isCreatingStudent, currentStepIndex, onboardingStep, isParsed]);

    const handleDismiss = () => {
        const confirmed = window.confirm('Isso leva menos de 1 minuto e já deja seu primeiro aluno pronto. Quer sair agora?')
        if (confirmed) {
            complete()
        }
    }

    if (!isDesktop || !isTourActive || allSteps.length === 0 || isImpersonating) return null

    return (
        <SpotlightTour 
            steps={allSteps}
            currentPhase={globalStepIndex}
            totalPhases={8}
            stepIndex={currentStepIndex}
            onStepChange={(index) => setCurrentStepIndex(index)}
            active={isTourActive}
            onComplete={() => {
                if (onboardingStep === 'discovery') {
                    complete()
                } else if (onboardingStep === 'aha_moment' && pathname.includes('/students/')) {
                    complete()
                }
            }}
            onDismiss={handleDismiss}
        />
    )
}
