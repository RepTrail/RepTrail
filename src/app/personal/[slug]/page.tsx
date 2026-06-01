import { notFound } from 'next/navigation'
import { getTrainerPublicProfileData } from '@/lib/dal/server'
import { headers } from 'next/headers'
import { TrainerPublicProfileMain } from '@/components/store/advanced/trainer-public-profile-main'
import { DashboardShell } from '@/components/store/advanced/dashboard-shell'
import { RegistryProvider } from '@/components/store/advanced/registry-context'
import { RegistryMain } from '@/components/store/advanced/registry-main'
import { Surface } from '@/components/store/base/surface'
import { BackgroundEffects } from '@/components/store/base/background-effects'
import { Box } from '@/components/store/base/box'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export const metadata = {
    title: 'Perfil do Treinador | RepTrail',
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

export default async function TrainerPublicProfilePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    const headerList = await headers()
    const viewerId = headerList.get('x-user-id')

    // Normalize slug - remove null, undefined, or empty strings
    const normalizedSlug = slug?.trim().toUpperCase() || ''

    if (!normalizedSlug || normalizedSlug === 'NULL' || normalizedSlug === 'UNDEFINED') {
        notFound()
    }

    const trainerProfileData = await getTrainerPublicProfileData(normalizedSlug, viewerId)
    if (!trainerProfileData) notFound()

    const { publicData, viewerProfile } = trainerProfileData
    const { trainer, reviews, photos } = publicData

    if (!trainer || !trainer.trainer_code) {
        notFound()
    }

    // ── Enforce default trainer 'emerald' theme for content elements ───────────
    const mainContent = (
        <RegistryProvider defaultColor="emerald">
            <RegistryMain
                title="PERFIL DO TREINADOR"
                subtitle="Acompanhe a biografia, metodologia, depoimentos e transformações do seu coach."
                icon="UserCheck"
                contextLabel="Perfil Público"
                showTabs={false}
            >
                <TrainerPublicProfileMain
                    trainer={trainer}
                    reviews={reviews || []}
                    photos={photos || []}
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

    return (
        <Surface
            minHeight="screen"
            bg={STORE_TOKENS.COLORS.BACKGROUND}
            bgOpacity={STORE_TOKENS.OPACITY.BACKGROUND}
            overflowX="hidden"
            display="flex"
            direction="col"
            position="relative"
        >
            <BackgroundEffects variant="all" />
            <Box position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT} flex1>
                {mainContent}
            </Box>
        </Surface>
    );
}
