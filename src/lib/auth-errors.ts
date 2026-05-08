export const translateAuthError = (error: string | null): string | null => {
    if (!error) return null

    const lowerError = error.toLowerCase()

    if (lowerError.includes('invalid login credentials')) {
        return 'Credenciais de acesso inválidas. Verifique seu email e senha.'
    }

    if (lowerError.includes('email not confirmed')) {
        return 'Email ainda não confirmado. Verifique sua caixa de entrada.'
    }

    if (lowerError.includes('user already registered')) {
        return 'Este email já possui cadastro em nossa plataforma.'
    }

    if (lowerError.includes('password should be at least 6 characters')) {
        return 'A senha deve conter pelo menos 6 caracteres.'
    }

    if (lowerError.includes('rate limit exceeded')) {
        return 'Muitas tentativas. Tente novamente em alguns instantes.'
    }

    if (lowerError.includes('signup disabled')) {
        return 'O cadastro de novos usuários está temporariamente desativado.'
    }

    if (lowerError.includes('invalid email')) {
        return 'Por favor, insira um endereço de email válido.'
    }

    // Default return for unknown errors or already translated ones
    return error
}
