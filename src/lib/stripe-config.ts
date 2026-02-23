// Stripe pricing configuration
export const STRIPE_PRICES = {
    // Student Plans
    AUTO_TRAINING_MONTHLY: {
        id: 'price_1T3qUZRrnMgl7YdWboa5qAS2',
        amount: 1090, // R$ 10,90 in cents
        currency: 'brl',
        interval: 'month',
        intervalCount: 1,
        description: 'Plano Auto-Training - Acesso mensal'
    },

    // Trainer Plans (add others here as needed)
    TRAINER_ELITE_MONTHLY: {
        id: 'price_1xxx', // Add the actual price ID
        amount: 0, // Add the amount
        currency: 'brl',
        interval: 'month',
        intervalCount: 1,
        description: 'Plano Elite - Trainer mensal'
    }
}

export const TRIAL_DURATION_DAYS = 7

export function formatPrice(amountInCents: number, currency: string = 'brl') {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(amountInCents / 100)
}
