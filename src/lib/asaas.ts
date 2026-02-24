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

    // Check if the response actually has content before parsing JSON
    // Some Asaas endpoints (like DELETE) return a 200 OK but with an empty body
    const contentType = response.headers.get('content-type')
    const hasJson = contentType && contentType.includes('application/json')

    let data: any = {}
    const text = await response.text()

    if (text) {
        try {
            data = JSON.parse(text)
        } catch (e) {
            console.error('[ASAAS_PARSE_ERROR]', text)
            // If it's not JSON but has content, it might be an error or plain text
            if (!response.ok) throw new Error('Resposta inválida do servidor Asaas')
        }
    }

    if (!response.ok) {
        console.error('[ASAAS_ERROR_STATUS]', response.status)
        console.error('[ASAAS_ERROR_DATA]', data)

        const description = data.errors?.[0]?.description || data.message || `Erro ${response.status} na integração com Asaas`
        throw new Error(description)
    }

    return data
}
