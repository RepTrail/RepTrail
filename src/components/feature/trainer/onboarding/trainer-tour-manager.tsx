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
    
    // Fetch profile to get real stats
    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.profile.detail(userId),
        queryFn: () => getTrainerProfile()
    })

    const { step: onboardingStep, isTourActive, dismissTour, complete } = useTrainerOnboarding(userId, { 
        activeStudents: profile?.stats?.active_students || 0, 
        workoutsCount: 0, 
        dietsCount: 0 
    })

    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [isDesktop, setIsDesktop] = useState(false)

    // Only run on desktop (>= 1024px)
    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 1024)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])
    const [showBindingModes, setShowBindingModes] = useState(false)
    const [isCreatingStudent, setIsCreatingStudent] = useState(false)
    const [isParsed, setIsParsed] = useState(false)

    // ⚡ RESET EFFECT: Reset tour index when significant state changes
    // We use a single effect with a stable dependency array to satisfy React Hook rules.
    useEffect(() => {
        setCurrentStepIndex(0)
    }, [pathname, showBindingModes, isCreatingStudent, isParsed, onboardingStep])

    useEffect(() => {
        if (pathname !== '/dashboard/trainer/import-pdf') return
        const check = () => {
            const btn = document.querySelector('#tour-btn-create-student')
            const fields = document.querySelector('#tour-student-fields')
            const parsed = document.querySelector('#tour-parsed-status')
            setShowBindingModes(!!btn)
            setIsCreatingStudent(!!fields)
            setIsParsed(!!parsed)
        }
        const interval = setInterval(check, 500)
        return () => clearInterval(interval)
    }, [pathname])

    const allSteps = useMemo(() => {
        const steps: (TourStep & { path: string, condition?: boolean })[] = [
            // PASSO 1: Dashboard
            {
                path: '/dashboard/trainer',
                selector: '#tour-import-pdf',
                title: 'Passo 1: Começar',
                content: 'Clique aqui para abrir o importador inteligente.',
                position: 'right',
                condition: onboardingStep === 'import_diet'
            },
            // PASSO 2: Tipo de PDF
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-import-type',
                title: 'Passo 2: Definir',
                content: 'Escolha se vai importar um TREINO ou uma DIETA.',
                position: 'bottom',
                condition: onboardingStep === 'import_diet' && !isParsed,
                showNextButton: true
            },
            // PASSO 3: Upload
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-dropzone',
                title: 'Passo 3: Importar',
                content: 'Solte seu PDF aqui para começar a leitura.',
                position: 'top',
                condition: onboardingStep === 'import_diet' && !isParsed
            },
            // PASSO 4: Criar Aluno (Botão)
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-btn-create-student',
                title: 'Passo 4: Vincular',
                content: 'Clique em "Criar Novo Aluno" para cadastrar o destinatário.',
                position: 'top',
                condition: onboardingStep === 'import_diet' && showBindingModes && !isCreatingStudent
            },
            // PASSO 5: Preencher Dados
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-student-fields',
                title: 'Passo 5: Identificar',
                content: 'Preencha o nome e email do seu novo aluno.',
                position: 'top',
                condition: onboardingStep === 'import_diet' && showBindingModes && isCreatingStudent,
                showNextButton: true,
                noPulse: true
            },
            // PASSO 6: Conferir (Alvo: Card de Importação)
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-import-card',
                title: 'Passo 6: Conferir',
                content: 'Revise os dados importados abaixo. Quando terminar, desça a tela e clique em Salvar e Atribuir.',
                position: 'top-right',
                isFixed: true,
                condition: onboardingStep === 'import_diet' && showBindingModes && isCreatingStudent,
                noPulse: true,
                showArrow: true
            },
            // PASSO 7: Ir para Alunos (Sidebar)
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-sidebar-students',
                title: 'Passo 7: Ver Alunos',
                content: 'Tudo pronto! Agora vamos conferir como o aluno recebeu esses dados. Clique em "Alunos" no menu lateral.',
                position: 'right',
                condition: onboardingStep === 'aha_moment'
            },
            // PASSO 8: Abrir Perfil (Lista de Alunos)
            {
                path: '/dashboard/trainer/students',
                selector: '#tour-view-profile-0',
                title: 'Passo 8: Ver Perfil',
                content: 'O aluno foi criado automaticamente. Clique em "Perfil" para ver o protocolo dele.',
                position: 'left',
                condition: onboardingStep === 'aha_moment'
            },
            // PASSO 9: AHA MOMENT (Perfil do Aluno)
            {
                path: '/dashboard/trainer/students/[id]', 
                selector: '#tour-aha-card',
                title: '🎉 Tutorial Concluído!',
                content: 'Sensacional! O protocolo já está ativo. Agora é só pedir para o aluno se cadastrar usando o e-mail que você definiu. Quando ele entrar, tudo já estará lá!\n\nSinta-se livre para explorar a plataforma e transformar sua consultoria.',
                position: 'center',
                condition: onboardingStep === 'aha_moment',
                showNextButton: true,
                noPulse: true
            }
        ]

        return steps.filter(s => s.path === pathname || (s.path.includes('[id]') && pathname.includes('/students/')))
            .filter(s => s.condition === undefined || s.condition)
    }, [pathname, onboardingStep, showBindingModes, isCreatingStudent])

    // Progress mapping (Re-written for reliability)
    const globalStepIndex = useMemo(() => {
        // Priority to later steps
        if (onboardingStep === 'aha_moment') {
            if (pathname.includes('/students/')) return 9;
            if (pathname === '/dashboard/trainer/students') return 8;
            return 7;
        }

        if (onboardingStep === 'import_diet') {
            if (pathname === '/dashboard/trainer') return 1;
            if (pathname === '/dashboard/trainer/import-pdf') {
                if (showBindingModes && isCreatingStudent) return 5 + currentStepIndex;
                if (isParsed) return 4;
                return 2 + currentStepIndex;
            }
        }

        return 1;
    }, [pathname, showBindingModes, isCreatingStudent, currentStepIndex, onboardingStep]);

    if (!isDesktop || !isTourActive || allSteps.length === 0) return null

    return (
        <SpotlightTour 
            steps={allSteps}
            currentPhase={globalStepIndex}
            totalPhases={9}
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
            onDismiss={dismissTour}
        />
    )
}
