export function getTodayStrBrazil() {
    const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

export function getTodayRangeBrazil() {
    const todayStr = getTodayStrBrazil()

    // Cria data start as 00:00 BRT (UTC-3)
    const start = new Date(`${todayStr}T00:00:00-03:00`)
    // Cria data end as 23:59:59.999 BRT
    const end = new Date(`${todayStr}T23:59:59.999-03:00`)

    return {
        start: start.toISOString(),
        end: end.toISOString()
    }
}

export function formatToBrazilDate(isoString: string) {
    const d = new Date(new Date(isoString).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}
