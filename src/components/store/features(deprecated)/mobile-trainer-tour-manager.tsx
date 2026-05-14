'use client'

import { usePathname } from 'next/navigation'
import { useTrainerOnboarding } from '@/hooks/use-trainer-onboarding'
import { SpotlightTour, TourStep } from '@/components/shared/spotlight-tour'
import { useMemo, useState, useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/lib/query-keys'
import { getTrainerProfile } from '@/actions/trainer-actions'

interface MobileTrainerTourManagerProps {
    userId: string
}

export function MobileTrainerTourManager({ userId }: MobileTrainerTourManagerProps) {
    const pathname = usePathname()
    
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [showBindingModes, setShowBindingModes] = useState(false)
    const [isCreatingStudent, setIsCreatingStudent] = useState(false)
    const [isParsed, setIsParsed] = useState(false)
    const [isImpersonating, setIsImpersonating] = useState(false)

    const { data: profile } = useQuery({
        queryKey: QUERY_KEYS.profile.detail(userId),
        queryFn: () => getTrainerProfile()
    })

    const { step: onboardingStep, isTourActive, dismissTour, complete } = useTrainerOnboarding(userId, { 
        activeStudents: profile?.stats?.active_students || 0, 
        workoutsCount: 0, 
        dietsCount: 0 
    })

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024)
        check()
        window.addEventListener('resize', check)
        
        const cookies = document.cookie.split('; ')
        const imp = cookies.find(c => c.startsWith('rt_impersonating='))?.split('=')[1]
        setIsImpersonating(imp === 'true')

        return () => window.removeEventListener('resize', check)
    }, [])

    useEffect(() => {
        if (currentStepIndex !== 0) setCurrentStepIndex(0)
    }, [pathname, isMenuOpen, showBindingModes, isCreatingStudent, isParsed, onboardingStep])

    // Monitoring for UI states
    useEffect(() => {
        const interval = setInterval(() => {
            // Check if mobile menu is open (by looking for the backdrop or the panel)
            const menuPanel = document.querySelector('div[class*="animate-in slide-in-from-right"]')
            const hasMenu = !!menuPanel
            if (hasMenu !== isMenuOpen) setIsMenuOpen(hasMenu)

            if (pathname === '/dashboard/trainer/import-pdf') {
                const btn = document.querySelector('#tour-btn-create-student')
                const fields = document.querySelector('#tour-student-fields')
                const parsed = document.querySelector('#tour-parsed-status')
                
                if (!!btn !== showBindingModes) setShowBindingModes(!!btn)
                if (!!fields !== isCreatingStudent) setIsCreatingStudent(!!fields)
                if (!!parsed !== isParsed) setIsParsed(!!parsed)
            }
        }, 500)
        return () => clearInterval(interval)
    }, [pathname, isMenuOpen, showBindingModes, isCreatingStudent, isParsed])

    const allSteps = useMemo(() => {
        const steps: (TourStep & { path: string, condition?: boolean })[] = [
            {
                path: '/dashboard/trainer',
                selector: '#tour-mobile-hamburger',
                title: 'Comece agora',
                content: 'Toque no menu para acessar as ferramentas de importação e gestão.',
                position: 'bottom',
                condition: onboardingStep === 'import_diet' && !isMenuOpen
            },
            {
                path: '/dashboard/trainer',
                selector: '#tour-mobile-link-import',
                title: 'Importar PDF',
                content: 'Clique aqui para começar a importar seus treinos ou dietas.',
                position: 'left',
                condition: onboardingStep === 'import_diet' && isMenuOpen
            },
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-import-type',
                title: 'O que vamos importar?',
                content: 'Selecione se é um treino ou uma dieta.',
                position: 'bottom',
                condition: onboardingStep === 'import_diet' && !isParsed,
                showNextButton: true
            },
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-dropzone',
                title: 'Suba o arquivo',
                content: 'Toque para selecionar o PDF do seu celular.',
                position: 'top',
                condition: onboardingStep === 'import_diet' && !isParsed
            },
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-student-fields',
                title: 'Quem é o aluno?',
                content: 'Informe o nome e e-mail. Ele receberá o acesso automaticamente.',
                position: 'top',
                condition: onboardingStep === 'import_diet' && showBindingModes && isCreatingStudent,
                showNextButton: true,
                noPulse: true
            },
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-import-card',
                title: 'Conferência final',
                content: 'Revise os dados. Se estiver ok, salve para finalizar.',
                position: 'top',
                condition: onboardingStep === 'import_diet' && showBindingModes && isCreatingStudent,
                noPulse: true
            },
            // MOBILE NAVIGATION STEPS
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-mobile-hamburger',
                title: 'Abrir Menu',
                content: 'Toque no ícone do menu para navegar até sua lista de alunos.',
                position: 'bottom',
                condition: onboardingStep === 'aha_moment' && !isMenuOpen
            },
            {
                path: '/dashboard/trainer/import-pdf',
                selector: '#tour-mobile-link-students',
                title: 'Ver Alunos',
                content: 'Toque em Alunos para ver o perfil que acabamos de criar.',
                position: 'left',
                condition: onboardingStep === 'aha_moment' && isMenuOpen
            },
            {
                path: '/dashboard/trainer/students',
                selector: '#tour-view-profile-0',
                title: 'Quase lá',
                content: 'Abra o perfil do aluno para ver o resultado.',
                position: 'top',
                condition: onboardingStep === 'aha_moment'
            },
            {
                path: '/dashboard/trainer/students/[id]', 
                selector: '#tour-aha-card',
                title: '🎉 Tudo pronto!',
                content: 'O plano já está no app do seu aluno. Digitalização concluída em segundos!',
                position: 'center',
                condition: onboardingStep === 'aha_moment',
                showNextButton: true,
                nextButtonLabel: 'Finalizar',
                noPulse: true
            }
        ]

        return steps.filter(s => s.path === pathname || (s.path.includes('[id]') && pathname.includes('/students/')))
            .filter(s => s.condition === undefined || s.condition)
    }, [pathname, onboardingStep, showBindingModes, isCreatingStudent, isParsed, isMenuOpen])

    const globalStepIndex = useMemo(() => {
        if (onboardingStep === 'aha_moment') {
            if (pathname.includes('/students/')) return 10;
            if (pathname === '/dashboard/trainer/students') return 9;
            if (isMenuOpen) return 8;
            return 7;
        }
        if (onboardingStep === 'import_diet') {
            if (pathname === '/dashboard/trainer') {
                return isMenuOpen ? 2 : 1;
            }
            if (pathname === '/dashboard/trainer/import-pdf') {
                if (showBindingModes && isCreatingStudent) return 5 + currentStepIndex;
                if (isParsed) return 4;
                return 3 + currentStepIndex;
            }
        }
        return 1;
    }, [pathname, showBindingModes, isCreatingStudent, currentStepIndex, onboardingStep, isParsed, isMenuOpen]);

    const handleDismiss = () => {
        if (window.confirm('Quer sair do tutorial? É rapidinho!')) complete()
    }

    if (!isMobile || !isTourActive || allSteps.length === 0 || isImpersonating) return null

    return (
        <SpotlightTour 
            steps={allSteps}
            currentPhase={globalStepIndex}
            totalPhases={10}
            stepIndex={currentStepIndex}
            onStepChange={(index) => setCurrentStepIndex(index)}
            active={isTourActive}
            onComplete={() => complete()}
            onDismiss={handleDismiss}
        />
    )
}
