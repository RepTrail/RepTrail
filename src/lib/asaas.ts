import { getAsaasApiKey } from '@/actions/app-settings-actions'

export async function fetchAsaas(endpoint: string, options: RequestInit = {}) {
    // Priority: Database App Settings -> process.env.ASAAS_API_KEY
    const dbApiKey = await getAsaasApiKey()
    const finalApiKey = dbApiKey || process.env.ASAAS_API_KEY
    const apiUrl = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3'

    console.log(`[ASAAS_DEBUG] Using URL: ${apiUrl}`)
    console.log(`[ASAAS_DEBUG] process.env.ASAAS_API_KEY present: ${!!process.env.ASAAS_API_KEY} (len: ${process.env.ASAAS_API_KEY?.length || 0})`)
    console.log(`[ASAAS_DEBUG] API Key from getAsaasApiKey(): ${!!dbApiKey} (len: ${dbApiKey?.length || 0})`)

    if (!finalApiKey) {
        console.error('[ASAAS_ERROR] ASAAS_API_KEY is not set in DB or ENV!')
        throw new Error('ASAAS_API_KEY is not set. Configure it in Admin -> Settings.')
    }

    const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    const url = `${baseUrl}${cleanEndpoint}`

    console.log(`[ASAAS_DEBUG] Request: ${options.method || 'GET'} ${url}`)

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'access_token': finalApiKey as string,
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
            console.error('[ASAAS_PARSE_ERROR]', text.substring(0, 500))
            // If it's not JSON but has content, it's definitely an error (e.g. HTML login page from wrong API URL)
            throw new Error(`Resposta inválida do servidor Asaas. Esperava JSON, recebeu: ${text.substring(0, 50)}...`)
        }
    }

    if (!response.ok) {
        console.error('[ASAAS_ERROR_STATUS]', response.status)
        console.error('[ASAAS_ERROR_DATA]', JSON.stringify(data, null, 2))

        let description = 'Ocorreu um erro na integração com Asaas.'

        if (data.errors && Array.isArray(data.errors)) {
            // Join all error descriptions if multiple exist
            description = data.errors.map((e: any) => e?.description).join(' | ')
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
