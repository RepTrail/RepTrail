export async function fetchAsaas(endpoint: string, options: RequestInit = {}) {
    const apiKey = process.env.ASAAS_API_KEY
    const apiUrl = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/v3'

    console.log(`[ASAAS_DEBUG] Using URL: ${apiUrl}`)
    console.log(`[ASAAS_DEBUG] API Key present: ${!!apiKey} (len: ${apiKey?.length || 0})`)

    if (!apiKey) {
        console.error('[ASAAS_ERROR] process.env.ASAAS_API_KEY is undefined!')
        console.log('[ASAAS_DEBUG] All Env Keys:', Object.keys(process.env).filter(k => k.includes('ASAAS') || k.includes('SUPABASE')))
        throw new Error('ASAAS_API_KEY is not set')
    }

    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = `${baseUrl}${cleanEndpoint}`

    console.log(`[ASAAS_DEBUG] Request: ${options.method || 'GET'} ${url}`)

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'access_token': apiKey,
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
        console.error('[ASAAS_ERROR_DATA]', JSON.stringify(data, null, 2))

        let description = 'Ocorreu um erro na integração com Asaas.'

        if (data.errors && Array.isArray(data.errors)) {
            // Join all error descriptions if multiple exist
            description = data.errors.map((e: any) => e.description).join(' | ')
        } else if (data.message) {
            description = data.message
        } else if (response.status === 401) {
            description = 'Chave de API do Asaas inválida ou expirada.'
        } else if (response.status === 403) {
            description = 'Acesso negado ao recurso do Asaas.'
        }

        throw new Error(description)
    }

    return data
}
