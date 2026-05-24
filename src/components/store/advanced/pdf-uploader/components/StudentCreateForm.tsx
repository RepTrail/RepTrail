 
import React from 'react';
import { Stack } from '@/components/store/base/stack';
import { Surface } from '@/components/store/base/surface';
import { Font } from '@/components/store/base/font';
import { Icon } from '@/components/store/base/icon';
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
        <Surface id="tour-student-fields" variant="raised" padding={STORE_TOKENS.PADDING.CONTAINER} animateIn="fade">
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
                        icon={<Icon icon={Mail} size="xs" color="zinc-500" />}
                        value={placeholderEmail}
                        onChange={(e) => setPlaceholderEmail(e.target.value)}
                    />
                    <Font variant="sub-tiny" color="zinc-600" weight="bold" uppercase tracking="widest" className="px-1">
                        O aluno precisa criar a conta com esse email para sincronizar o protocolo automaticamente.
                    </Font>
                </Stack>

                <DSInput
                    label="WhatsApp do Aluno"
                    placeholder="(00) 00000-0000"
                    type="tel"
                    icon={<Icon icon={Phone} size="xs" color="zinc-500" />}
                    value={placeholderWhatsapp}
                    onChange={(e) => setPlaceholderWhatsapp(e.target.value)}
                />

                <Font variant="sub-tiny" color="primary" weight="black" uppercase tracking="widest" className="px-1">
                    * O email e WhatsApp são fundamentais para o envio automático do acesso.
                </Font>
            </Stack>
        </Surface>
    );
}
