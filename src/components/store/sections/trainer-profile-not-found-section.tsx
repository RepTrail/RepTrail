import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function TrainerProfileNotFoundSection() {
    return (
        <Box fullWidth padding={STORE_TOKENS.PADDING.CONTAINER} textAlign="center">
            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold">
                Perfil não encontrado.
            </Font>
        </Box>
    )
}
