'use client'

import { useState, useEffect } from 'react'
import { impersonateUser } from '@/lib/dal/remote'
import { Button } from '@/components/store/base/button'
import { ShieldAlert, ArrowLeftRight, RefreshCw } from 'lucide-react'
import { useToast } from '@/components/store/hooks/use-toast'
import { Box } from '@/components/store/base/box'
import { Inline } from '@/components/store/base/layout'
import { Font } from '@/components/store/base/font'
import { Icon } from '@/components/store/base/icon'
import { Badge } from '@/components/store/base/badge'
import { Surface } from '@/components/store/base/surface'
import { RegistryColor } from '@/components/store/base/registry-context'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function ImpersonationBar({ color }: { color?: RegistryColor }) {
    const [mounted, setMounted] = useState(false)
    const [isImpersonating, setIsImpersonating] = useState(false)
    const [adminId, setAdminId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    useEffect(() => {
        setMounted(true)
        const checkStatus = () => {
            const cookies = document.cookie.split('; ')
            const imp = cookies.find(c => c.startsWith('rt_impersonating='))?.split('=')[1]
            const aid = cookies.find(c => c.startsWith('rt_admin_id='))?.split('=')[1]

            setIsImpersonating(imp === 'true')
            setAdminId(aid || null)
        }

        checkStatus()
        const interval = setInterval(checkStatus, 2000)
        return () => clearInterval(interval)
    }, [])

    if (!mounted || !isImpersonating || !adminId) return null

    const handleReturn = async () => {
        setLoading(true)
        toast({ title: 'Retornando ao Admin...', description: 'Estamos restaurando sua sessão original.' })

        const res = await impersonateUser(adminId)
        if (res?.error) {
            toast({ variant: 'destructive', title: 'Erro ao retornar', description: res.error })
            setLoading(false)
        }
    }

    const primaryColor = color || 'orange'
    const safeIconColor = primaryColor === 'zinc' ? 'zinc-400' : primaryColor

    return (
        <Box position="relative" fullWidth display={{ base: 'none', md: 'block' }}>
            <Surface
                variant={`tonal-${primaryColor}` as any}
                rounded={STORE_TOKENS.RADIUS.NONE}
                padding={STORE_TOKENS.PADDING.CONTAINER}
            >
                <Inline justify="between" align="center" gap={STORE_TOKENS.SPACING.CONTAINER}>
                    <Inline gap={STORE_TOKENS.SPACING.CONTAINER} align="center">
                        <Badge
                            label="Modo Inspeção Ativo"
                            icon={ShieldAlert}
                            variant="glass"
                            color={primaryColor}
                            rounded={STORE_TOKENS.RADIUS.FULL}
                        />
                        <Box display={{ base: 'none', md: 'block' }}>
                            <Font
                                variant="sub-tiny"
                                weight="bold"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.SECONDARY,
                                }}>
                                Você está visualizando a plataforma como outro usuário. Todas as ações afetarão a conta dele.
                            </Font>
                        </Box>
                    </Inline>

                    <Button
                        onClick={handleReturn}
                        disabled={loading}
                        variant={`outline-${primaryColor}` as any}
                        size="sm"
                        rounded={STORE_TOKENS.RADIUS.FULL}
                    >
                        <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                            {loading ? (
                                <Icon icon={RefreshCw} size="xs" color={safeIconColor as any} animate="spin" />
                            ) : (
                                <Icon icon={ArrowLeftRight} size="xs" color={safeIconColor as any} />
                            )}
                            <Font
                                variant="label-caps"
                                {...{
                                    color: STORE_TOKENS.COLORS.TEXT.PRIMARY,
                                }}>Voltar ao Admin</Font>
                        </Inline>
                    </Button>
                </Inline>
            </Surface>
        </Box>
    );
}
