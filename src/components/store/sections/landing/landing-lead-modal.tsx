'use client'

import React, { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Box } from '@/components/store/base/box'
import { Stack } from '@/components/store/base/stack'
import { Font } from '@/components/store/base/font'
import { Button } from '@/components/store/base/button'
import { Input } from '@/components/store/base/input'
import { ModalOverlay, ModalContainer } from '@/components/store/base/layout'
import { Icon } from '@/components/store/base/icon'
import { useRegistry } from '@/components/store/advanced/registry-context'
import { ArrowRight, Loader2 } from 'lucide-react'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

interface LeadCaptureModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  trainerName?: string
  trainerCode?: string
}

export function LandingLeadModal({ isOpen, onOpenChange, trainerName, trainerCode }: LeadCaptureModalProps) {
  const { primaryColor } = useRegistry()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [animateState, setAnimateState] = useState<'closed' | 'open'>('closed')

  useEffect(() => {
    if (isOpen) {
      setAnimateState('open')
    } else {
      setAnimateState('closed')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            whatsapp: whatsapp,
            role: 'student',
          },
        },
      })
      if (signUpError) throw signUpError

      // Guarantee the name is saved regardless of trigger behavior
      if (data?.user?.id) {
        await supabase
          .from('profiles')
          .update({ full_name: fullName, whatsapp: whatsapp })
          .eq('id', data.user.id)
      }

      // Success state
      setSuccess(true)

      // Wait a moment for the user to see the success message
      setTimeout(() => {
        onOpenChange(false)
        if (trainerCode) {
          router.push(`/personal/${trainerCode.toUpperCase().trim()}`)
        } else {
          router.push('/dashboard/student')
        }
      }, 1500)

    } catch (err: any) {
      setError(err.message)
    } finally {
      if (!success) setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <ModalOverlay onClose={() => onOpenChange(false)} animateState={animateState}>
      <ModalContainer animateState={animateState}>
        <Box 
          bg={STORE_TOKENS.COLORS.BACKGROUND} 
          bgOpacity={STORE_TOKENS.OPACITY.SURFACE}
          padding={STORE_TOKENS.PADDING.CONTAINER}
          rounded={STORE_TOKENS.RADIUS.SYSTEM}
          border
          borderColor={STORE_TOKENS.COLORS.BACKGROUND}
          borderOpacity={STORE_TOKENS.OPACITY.MEDIUM}
          maxWidth="auth-form"
          width="full"
          position="relative"
          overflow="hidden"
          shadow="xl"
        >
          <Box position="relative" zIndex={STORE_TOKENS.Z_INDEX.CONTENT}>
            {!success ? (
              <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                
                {/* Header text */}
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" textAlign="center">
                  <Font variant="h3" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic align="center">
                    Crie sua conta Grátis
                  </Font>
                  <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align="center">
                    {trainerName
                      ? `Para entrar em contato com ${trainerName}, você precisa de uma conta no RepTrail.`
                      : 'Junte-se ao RepTrail para acessar os melhores treinadores.'}
                  </Font>
                </Stack>

                {/* Form fields */}
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                  <Stack gap={STORE_TOKENS.SPACING.CONTAINER} fullWidth>
                    {error && (
                      <Box 
                        padding={STORE_TOKENS.PADDING.ELEMENT} 
                        bg={STORE_TOKENS.COLORS.ERROR} 
                        bgOpacity={STORE_TOKENS.OPACITY.SUBTLE} 
                        border 
                        borderColor={STORE_TOKENS.COLORS.ERROR} 
                        borderOpacity={STORE_TOKENS.OPACITY.MEDIUM} 
                        rounded={STORE_TOKENS.RADIUS.SYSTEM}
                      >
                        <Font variant="auxiliary" color="red" weight="black" uppercase tracking="wider">
                          {error}
                        </Font>
                      </Box>
                    )}

                    <Input
                      label="Nome Completo"
                      placeholder="Seu nome"
                      value={fullName}
                      onChange={(e: any) => setFullName(e.target.value)}
                      required
                    />

                    <Input
                      label="Email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e: any) => setEmail(e.target.value)}
                      required
                    />

                    <Input
                      label="WhatsApp"
                      placeholder="(11) 99999-9999"
                      mask="phone"
                      value={whatsapp}
                      onChange={(e: any) => setWhatsapp(e.target.value)}
                      required
                    />

                    <Input
                      label="Senha"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e: any) => setPassword(e.target.value)}
                      required
                    />

                    <Box width="full">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        activeScale={95}
                        fullWidth
                        loading={loading}
                      >
                        <Box as="span" display="flex" align="center" justify="center" gap={STORE_TOKENS.SPACING.ELEMENT} cursor="pointer">
                          <span>Criar Conta & Contatar</span>
                          <Icon icon={ArrowRight} size="sm" />
                        </Box>
                      </Button>
                    </Box>
                  </Stack>
                </form>

                {/* Bottom link */}
                <Box align="center" justify="center">
                  <Font variant="sub-tiny" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align="center" weight="medium">
                    Já tem uma conta?{' '}
                    <Font color={STORE_TOKENS.COLORS.BRAND} cursor="pointer" underline>
                      <a href="/auth/login">Fazer Login</a>
                    </Font>
                  </Font>
                </Box>
              </Stack>
            ) : (
              <Stack gap={STORE_TOKENS.SPACING.CONTAINER} align="center" justify="center">
                <Box 
                  width={80} 
                  height={80} 
                  bg={STORE_TOKENS.COLORS.BRAND} 
                  rounded={STORE_TOKENS.RADIUS.FULL} 
                  align="center" 
                  justify="center" 
                >
                  <Icon icon={ArrowRight} size="lg" color={STORE_TOKENS.COLORS.BACKGROUND} />
                </Box>
                
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT} align="center" textAlign="center">
                  <Font variant="h3" color={STORE_TOKENS.COLORS.TEXT.PRIMARY} uppercase italic align="center">
                    Conta Criada!
                  </Font>
                  <Font variant="body-sm" color={STORE_TOKENS.COLORS.TEXT.SECONDARY} align="center">
                    Redirecionando você para {trainerName || 'o perfil'}...
                  </Font>
                </Stack>

                <Icon icon={Loader2} size="md" color={STORE_TOKENS.COLORS.BRAND} animate="spin" opacity={50} />
              </Stack>
            )}
          </Box>
        </Box>
      </ModalContainer>
    </ModalOverlay>
  )
}
