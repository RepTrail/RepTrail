import { notFound } from 'next/navigation'
import { getStudentPublicProfileData, actions } from '@/lib/dal/server'
import { headers } from 'next/headers'
import { StudentPublicProfileMain } from '@/components/store/advanced/student-public-profile-main'
import { StudentPublicMetrics } from '@/components/store/advanced/student-public-metrics'
import { StudentPublicPhotos } from '@/components/store/advanced/student-public-photos'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { RegistryMain } from '@/components/store/advanced/registry-main'

export const metadata = {
    title: 'Perfil do Aluno | RepTrail',
}

const STUDENT_LINKS = [
    { href: '/dashboard/student',              label: 'Home',           icon: 'Home',          exact: true },
    { href: '/dashboard/student/workouts',     label: 'Meus Treinos',   icon: 'Dumbbell' },
    { href: '/dashboard/student/cardio',       label: 'Cardio',         icon: 'Activity' },
    { href: '/dashboard/student/diet',         label: 'Minha Dieta',    icon: 'Utensils' },
    { href: '/dashboard/student/ergogenics',   label: 'Ergogênicos',    icon: 'Syringe' },
    { href: '/dashboard/student/progress',     label: 'Evolução',       icon: 'TrendingUp' },
    { href: '/dashboard/student/feed',         label: 'Feed de Alunos', icon: 'UserCheck' },
    { href: '/dashboard/student/ranking',      label: 'Ranking',        icon: 'Trophy' },
    { href: '/dashboard/student/loja',         label: 'Loja',           icon: 'ShoppingBag' },
    { href: '/dashboard/student/profile',      label: 'Meu Perfil',     icon: 'User' },
]

const STUDENT_MOBILE_LINKS = [
    { href: '/dashboard/student',              label: 'Home',    icon: 'Home',       exact: true },
    { href: '/dashboard/student/workouts',     label: 'Treinos', icon: 'Dumbbell' },
    { href: '/dashboard/student/cardio',       label: 'Cardio',  icon: 'Activity' },
    { href: '/dashboard/student/loja',         label: 'Loja',    icon: 'ShoppingBag' },
    { href: '/dashboard/student/profile',      label: 'Meu Perfil', icon: 'User' },
]

const TRAINER_LINKS = [
    { href: '/dashboard/trainer',           label: 'Visão Geral',  icon: 'Home',         exact: true },
    { href: '/dashboard/trainer/students',   label: 'Alunos',       icon: 'Users' },
    { href: '/dashboard/trainer/workouts',   label: 'Treinos',      icon: 'Dumbbell' },
    { href: '/dashboard/trainer/diets',      label: 'Dietas',       icon: 'Utensils' },
    { href: '/dashboard/trainer/cardio',     label: 'Cardio',       icon: 'Activity' },
    { href: '/dashboard/trainer/ergogenics', label: 'Ergogênicos',  icon: 'FlaskConical' },
    { href: '/dashboard/trainer/loja',       label: 'Loja',         icon: 'ShoppingBag' },
    { href: '/dashboard/trainer/ranking',    label: 'Ranking',      icon: 'Trophy' },
    { href: '/dashboard/trainer/profile',    label: 'Meu Perfil',   icon: 'User' },
]

const TRAINER_MOBILE_LINKS = [
    { href: '/dashboard/trainer',            label: 'Início',  icon: 'Home',        exact: true },
    { href: '/dashboard/trainer/students',   label: 'Alunos',  icon: 'Users' },
    { href: '/dashboard/trainer/loja',       label: 'Loja',    icon: 'ShoppingBag' },
    { href: '/dashboard/trainer/ranking',    label: 'Ranking', icon: 'Trophy' },
]

export default async function StudentPublicProfilePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id: studentId } = await params
    const headerList = await headers()
    const viewerId = headerList.get('x-user-id')
    const isOwner = viewerId === studentId

    const publicProfileData = await getStudentPublicProfileData(studentId, viewerId)
    if (!publicProfileData) notFound()

    const { viewerProfile, profile, details, trainerLink, photos } = publicProfileData

    // ── Student Details & Data Fetches in Parallel ─────────────────────────────
    const [fullMetrics, adherenceHistory] = await Promise.all([
        actions.getStudentFullMetrics(studentId),
        actions.getStudentAdherenceHistory(studentId, 30),
    ])

    const trainerData = trainerLink?.trainer as
        | { id: string; full_name: string; avatar_url: string; trainer_code?: string }
        | undefined

    // ── Compose streamed tab content as ReactNode ──────────────────────────────
    const evolutionContent = (
        <StudentPublicMetrics 
            key="student-evolution-metrics"
            fullMetrics={fullMetrics} 
            adherenceHistory={adherenceHistory || []} 
            steroidUse={!!details?.steroid_use} 
        />
    )


    const photosContent = (
        <StudentPublicPhotos
            key="student-photos-gallery"
            studentId={studentId}
            isOwner={isOwner}
            studentName={profile.full_name}
            photos={photos || []}
        />
    )

    // ── Enforce default student 'orange' theme for content elements ─────────────
    const mainContent = (
        <RegistryProvider defaultColor="orange">
            <RegistryMain
                title="PERFIL DO ALUNO"
                subtitle="Acompanhe a evolução física, métricas de consistência e o histórico de treinos."
                icon="UserCheck"
                contextLabel="Perfil Público"
                showTabs={false}
            >
                <StudentPublicProfileMain
                    profile={profile}
                    trainerData={trainerData}
                    evolutionContent={evolutionContent}
                    photosContent={photosContent}
                />
            </RegistryMain>
        </RegistryProvider>
    )

    // ── Render with Sidebar Shell if Logged In, otherwise render pure page ──────
    if (viewerProfile) {
        const isTrainer = viewerProfile.role === 'trainer'
        const shellColor = isTrainer ? 'emerald' : 'orange'
        const links = isTrainer ? TRAINER_LINKS : STUDENT_LINKS
        const mobileLinks = isTrainer ? TRAINER_MOBILE_LINKS : STUDENT_MOBILE_LINKS
        const profileHref = isTrainer ? '/dashboard/trainer/profile' : '/dashboard/student/profile'

        return (
            <RegistryProvider defaultColor={shellColor}>
                <DashboardShell
                    color={shellColor}
                    links={links}
                    mobileLinks={mobileLinks}
                    profileHref={profileHref}
                    user={{
                        id: viewerId!,
                        name: viewerProfile.full_name,
                        email: viewerProfile.email,
                        avatar_url: viewerProfile.avatar_url,
                        isAdmin: viewerProfile.is_admin,
                        isAffiliate: viewerProfile.is_affiliate,
                    }}
                >
                    {mainContent}
                </DashboardShell>
            </RegistryProvider>
        )
    }

    return mainContent
}
