'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { TourOverlay } from './tour-overlay'

interface TrainerTourManagerProps {
    userId: string
}

export function TrainerTourManager({ userId }: TrainerTourManagerProps) {
    const pathname = usePathname()
    const [currentStep, setCurrentStep] = useState<number>(-1)
    const [isClient, setIsClient] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsClient(true)
        setIsMobile(window.innerWidth < 1024)
        
        const storageKey = `reptrail_trainer_tour_completed_${userId}`
        const isCompleted = localStorage.getItem(storageKey)
        
        const urlParams = new URLSearchParams(window.location.search);
        const forceTutorial = urlParams.get('tutorial') === 'true';

        const savedStep = sessionStorage.getItem(`reptrail_tour_step_${userId}`)
        
        if (forceTutorial) {
            setCurrentStep(0)
            sessionStorage.setItem(`reptrail_tour_step_${userId}`, '0')
        } else if (savedStep && parseInt(savedStep) >= 0) {
            setCurrentStep(parseInt(savedStep))
        } else if (!isCompleted) {
            setCurrentStep(0)
            sessionStorage.setItem(`reptrail_tour_step_${userId}`, '0')
        }
    }, [userId])

    const tourSteps = useMemo(() => {
        const steps: any[] = []
        let stepCount = 1

        if (isMobile) {
            steps.push({
                targetId: 'tour-mobile-hamburger',
                title: 'Abrir Menu',
                content: 'Toque no menu para acessar as opções.',
                subtext: `Passo ${stepCount++}`,
                advanceOnTargetClick: true
            })
        }

        steps.push({
            targetId: 'tour-import-pdf',
            title: 'Importar PDF',
            content: 'Clique em "Importar PDF" no menu para começar.',
            subtext: `Passo ${stepCount++}`,
        })

        steps.push({
            targetId: 'tour-dropzone',
            title: 'Área de Upload',
            content: 'Arraste e solte o PDF da avaliação aqui, ou clique para selecionar o arquivo do seu computador.',
            subtext: `Passo ${stepCount++}`,
        })

        steps.push({
            targetId: 'tour-btn-create-student',
            title: 'Vincular Aluno',
            content: 'Clique em "Criar Novo Aluno" para cadastrarmos o aluno enquanto importamos os dados.',
            subtext: `Passo ${stepCount++}`,
        })

        steps.push({
            targetId: 'tour-student-fields',
            title: 'Dados do Aluno',
            content: 'Preencha ou confirme os dados básicos do novo aluno.',
            subtext: `Passo ${stepCount++}`,
            buttonText: 'Próximo',
        })

        steps.push({
            targetId: 'tour-review-section',
            title: 'Revisar e Salvar',
            content: 'Revise todas as informações importadas e clique em Salvar.',
            subtext: `Passo ${stepCount++}`,
            advanceOnTargetClick: false,
        })

        if (isMobile) {
            steps.push({
                targetId: 'tour-mobile-hamburger',
                title: 'Abrir Menu',
                content: 'Toque no menu para acessar a lista de alunos.',
                subtext: `Passo ${stepCount++}`,
                advanceOnTargetClick: true
            })
        }

        steps.push({
            targetId: 'tour-sidebar-students',
            title: 'Lista de Alunos',
            content: 'Clique em "Alunos" no menu lateral para visualizar o aluno recém-cadastrado.',
            subtext: `Passo ${stepCount++}`,
        })

        steps.push({
            targetId: 'tour-open-profile',
            title: 'Abrir Perfil',
            content: 'Clique no botão ou no card para abrir o perfil detalhado do aluno.',
            subtext: `Passo ${stepCount++}`,
        })

        steps.push({
            targetId: 'tour-whatsapp-access',
            title: 'Enviar Acesso',
            content: 'Por fim, clique aqui para enviar o link de acesso diretamente no WhatsApp do aluno!',
            subtext: `Passo ${stepCount++}`,
        })

        return steps.map(s => ({ ...s, subtext: `${s.subtext} de ${stepCount - 1}` }))
    }, [isMobile])

    const step = tourSteps[currentStep]

    useEffect(() => {
        if (step?.targetId === 'tour-dropzone') {
            const interval = setInterval(() => {
                if (document.getElementById('tour-btn-create-student')) {
                    const nextStep = currentStep + 1
                    setCurrentStep(nextStep)
                    sessionStorage.setItem(`reptrail_tour_step_${userId}`, nextStep.toString())
                }
            }, 500)
            return () => clearInterval(interval)
        }
    }, [currentStep, userId, step])

    // Avanço manual para o passo de Revisão: avançar apenas quando o salvamento for concluído com sucesso
    useEffect(() => {
        if (step?.targetId === 'tour-review-section') {
            const handleSaveSuccess = () => {
                const nextStep = currentStep + 1
                setCurrentStep(nextStep)
                sessionStorage.setItem(`reptrail_tour_step_${userId}`, nextStep.toString())
            }
            window.addEventListener('reptrail_tour_advance_from_save', handleSaveSuccess)
            return () => window.removeEventListener('reptrail_tour_advance_from_save', handleSaveSuccess)
        }
    }, [currentStep, userId, step])

    // Sincronizar passos baseados em navegação de rotas (evita travamento se o click for engolido pelo Next.js)
    useEffect(() => {
        if (step?.targetId === 'tour-sidebar-students' && pathname === '/dashboard/trainer/students') {
            const nextStep = currentStep + 1
            setCurrentStep(nextStep)
            sessionStorage.setItem(`reptrail_tour_step_${userId}`, nextStep.toString())
        } else if (step?.targetId === 'tour-open-profile' && pathname.startsWith('/dashboard/trainer/students/') && pathname !== '/dashboard/trainer/students') {
            const nextStep = currentStep + 1
            setCurrentStep(nextStep)
            sessionStorage.setItem(`reptrail_tour_step_${userId}`, nextStep.toString())
        }
    }, [currentStep, pathname, userId, step])

    if (!isClient || currentStep < 0 || currentStep >= tourSteps.length) {
        return null
    }

    const handleNext = () => {
        if (currentStep === tourSteps.length - 1) {
            handleClose()
        } else {
            const nextStep = currentStep + 1
            setCurrentStep(nextStep)
            sessionStorage.setItem(`reptrail_tour_step_${userId}`, nextStep.toString())
        }
    }

    const handleClose = () => {
        const storageKey = `reptrail_trainer_tour_completed_${userId}`
        localStorage.setItem(storageKey, 'true')
        sessionStorage.removeItem(`reptrail_tour_step_${userId}`)
        setCurrentStep(-1)
    }

    return (
        <TourOverlay
            targetId={step.targetId}
            title={step.title}
            content={step.content}
            subtext={step.subtext}
            buttonText={step.buttonText}
            advanceOnTargetClick={(step as any).advanceOnTargetClick}
            onNext={handleNext}
            onClose={handleClose}
        />
    )
}
