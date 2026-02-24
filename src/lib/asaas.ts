export const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3'
export const ASAAS_API_KEY = process.env.ASAAS_API_KEY

export async function fetchAsaas(endpoint: string, options: RequestInit = {}) {
    if (!ASAAS_API_KEY) {
        throw new Error('ASAAS_API_KEY is not set')
    }

    const url = `${ASAAS_API_URL}${endpoint}`

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'access_token': ASAAS_API_KEY,
            ...options.headers,
        },
    })

    const data = await response.json()

    if (!response.ok) {
        console.error('[ASAAS_ERROR]', data)
        throw new Error(data.errors?.[0]?.description || 'Erro na integração com Asaas')
    }

    return data
}
