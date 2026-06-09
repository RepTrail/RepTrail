import { Box } from '@/components/store/base/box'
import { Font } from '@/components/store/base/font'
import { STORE_TOKENS } from '@/components/store/constants/tokens'

export function TrainerStudentNotFoundSection() {
    return (
        <Box fullWidth padding={STORE_TOKENS.PADDING.CONTAINER} textAlign="center">
            <Font variant="auxiliary" color={STORE_TOKENS.COLORS.TEXT.MUTED} weight="bold">
                Dados não encontrados ou você não tem acesso a este aluno.
            </Font>
        </Box>
    )
}
