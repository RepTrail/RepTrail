import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { StudentPublicProfileMain } from '@/components/store/advanced/student-public-profile-main'
import { StudentPublicMetrics } from '@/components/store/advanced/student-public-metrics'
import { StudentPublicPhotos } from '@/components/store/advanced/student-public-photos'
import { getStudentFullMetrics } from '@/actions/metrics-actions'
import { getStudentAdherenceHistory } from '@/actions/tracking-actions'
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
    const supabase = await createClient()
    const headerList = await headers()
    const viewerId = headerList.get('x-user-id')
    const isOwner = viewerId === studentId

    // ── Get Viewer Profile if Logged In (to determine sidebar role/color) ───────
    let viewerProfile: any = null
    if (viewerId) {
        const { data } = await supabase
            .from('profiles')
            .select('role, full_name, avatar_url, email, is_admin, is_affiliate')
            .eq('id', viewerId)
            .single()
        viewerProfile = data
    }

    // ── Core Profile (Fast) ────────────────────────────────────────────────────
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, created_at')
        .eq('id', studentId)
        .single()

    if (!profile) notFound()

    // ── Student Details & Data Fetches in Parallel ─────────────────────────────
    const [detailsResult, trainerLinkResult, photosResult, fullMetrics, adherenceHistory] = await Promise.all([
        supabase
            .from('student_details')
            .select('steroid_use')
            .eq('id', studentId)
            .single(),
        supabase
            .from('trainer_students')
            .select(`
                active,
                trainer:profiles!trainer_id(
                    id, full_name, avatar_url, trainer_code
                )
            `)
            .eq('student_id', studentId)
            .eq('active', true)
            .maybeSingle(),
        supabase
            .from('progress_photos')
            .select('*')
            .eq('student_id', studentId)
            .eq('is_private', false)
            .order('created_at', { ascending: false }),
        getStudentFullMetrics(studentId),
        getStudentAdherenceHistory(studentId, 30),
    ])

    const details = detailsResult.data
    const trainerLink = trainerLinkResult.data
    const photos = photosResult.data

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
