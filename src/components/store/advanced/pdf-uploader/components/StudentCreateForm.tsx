 
import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { GlassPanel } from '@/components/store/base/surface';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
import { Box } from '@/components/store/base/box';
import { Input as DSInput } from '@/components/store/base/input';
import { STORE_TOKENS } from '@/components/store/constants/tokens';
import { Mail, Phone } from 'lucide-react';

interface StudentCreateFormProps {
    placeholderName: string;
    setPlaceholderName: (v: string) => void;
    placeholderEmail: string;
    setPlaceholderEmail: (v: string) => void;
    placeholderWhatsapp: string;
    setPlaceholderWhatsapp: (v: string) => void;
}

export function StudentCreateForm({
    placeholderName, setPlaceholderName,
    placeholderEmail, setPlaceholderEmail,
    placeholderWhatsapp, setPlaceholderWhatsapp
}: StudentCreateFormProps) {
    return (
        <GlassPanel id="tour-student-fields" padding={STORE_TOKENS.PADDING.CONTAINER} animateIn="fade">
            <Stack gap={STORE_TOKENS.SPACING.CONTAINER}>
                <DSInput
                    label="Nome do Novo Aluno"
                    placeholder="Digite o nome completo..."
                    value={placeholderName}
                    onChange={(e) => setPlaceholderName(e.target.value)}
                />
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <DSInput
                        label="Email do Aluno"
                        placeholder="email@aluno.com"
                        type="email"
                        required
                        icon={<Icon icon={Mail} size="xs" color={STORE_TOKENS.COLORS.TEXT.MUTED} />}
                        value={placeholderEmail}
                        onChange={(e) => setPlaceholderEmail(e.target.value)}
                    />
                    <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                        <Font
                            variant="sub-tiny"
                            weight="bold"
                            uppercase
                            tracking="widest"
                            {...{
                                color: "zinc-600",
                            }}>
                            O aluno precisa criar a conta com esse email para sincronizar o protocolo automaticamente.
                        </Font>
                    </Box>
                </Stack>

                <DSInput
                    label="WhatsApp do Aluno"
                    placeholder="(00) 00000-0000"
                    type="tel"
                    icon={<Icon icon={Phone} size="xs" color={STORE_TOKENS.COLORS.TEXT.MUTED} />}
                    value={placeholderWhatsapp}
                    onChange={(e) => setPlaceholderWhatsapp(e.target.value)}
                />

                <Box padding={STORE_TOKENS.PADDING.ELEMENT}>
                    <Font
                        variant="sub-tiny"
                        weight="black"
                        uppercase
                        tracking="widest"
                        {...{
                            color: "primary",
                        }}>
                        * O email e WhatsApp são fundamentais para o envio automático do acesso.
                    </Font>
                </Box>
            </Stack>
        </GlassPanel>
    );
}
