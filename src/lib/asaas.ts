export const ASAAS_API_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/v3'
export const ASAAS_API_KEY = process.env.ASAAS_API_KEY

console.log(`[ASAAS_INIT] Base URL: ${ASAAS_API_URL}`)

export async function fetchAsaas(endpoint: string, options: RequestInit = {}) {
    if (!ASAAS_API_KEY) {
        throw new Error('ASAAS_API_KEY is not set')
    }

    const baseUrl = ASAAS_API_URL.endsWith('/') ? ASAAS_API_URL.slice(0, -1) : ASAAS_API_URL
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = `${baseUrl}${cleanEndpoint}`

    console.log(`[ASAAS_DEBUG] Request: ${options.method || 'GET'} ${url}`)

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
