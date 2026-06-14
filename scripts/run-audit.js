const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const DIR = path.join(__dirname, '../src/components/store/advanced')
const REPORT_PATH = path.join(__dirname, 'audit-layers-report.json')

function getFiles(dir, files = []) {
    const list = fs.readdirSync(dir)
    for (const file of list) {
        const filepath = path.join(dir, file)
        const stat = fs.statSync(filepath)
        if (stat.isDirectory()) {
            getFiles(filepath, files)
        } else if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
            files.push(filepath)
        }
    }
    return files
}

const allFiles = getFiles(DIR)
const violations = []
let highCount = 0
let mediumCount = 0
let lowCount = 0

function addViolation(file, lineNum, lineContent, ruleId, severity, desc) {
    violations.push({
        id: crypto.randomUUID(),
        rule_id: ruleId,
        severity: severity,
        layer: 'advanced',
        file: file.replace(path.join(__dirname, '..') + path.sep, '').replace(/\\/g, '/'),
        line: lineNum,
        description: desc,
        snippet: lineContent.trim(),
        fixed: false
    })

    if (severity === 'HIGH') highCount++
    if (severity === 'MEDIUM') mediumCount++
    if (severity === 'LOW') lowCount++
}

for (const file of allFiles) {
    const content = fs.readFileSync(file, 'utf-8')
    const lines = content.split('\n')

    lines.forEach((line, i) => {
        const lineNum = i + 1

        // ADV-001
        if (line.includes('className=')) {
            addViolation(file, lineNum, line, 'ADV-001', 'HIGH', 'Uso de className direto fora de base')
        }

        // ADV-004
        if (line.match(/\b(mt-|mb-|ml-|mr-)/)) {
            addViolation(file, lineNum, line, 'ADV-004', 'LOW', 'Uso de margens diretas proibidas')
        }

        // ADV-005
        if (line.match(/width=["']?[0-9]+["']?/) || line.match(/width=\{[0-9]+\}/)) {
            addViolation(file, lineNum, line, 'ADV-005', 'LOW', 'Uso de width fixo (proibido)')
        }
        if (line.match(/height=["']?[0-9]+["']?/) || line.match(/height=\{[0-9]+\}/)) {
            addViolation(file, lineNum, line, 'ADV-005', 'LOW', 'Uso de height fixo (proibido)')
        }

        // ADV-006 (Prohibited gaps)
        const gapMatch = line.match(/gap=\{([0-9]+)\}/)
        if (gapMatch) {
            const val = parseInt(gapMatch[1], 10)
            if (![0, 1, 5, 12].includes(val)) {
                addViolation(file, lineNum, line, 'ADV-006', 'LOW', 'Uso de gap fixo numérico proibido (fora dos tokens)')
            }
        }

        // ADV-007
        if (line.includes('<RegistrySection')) {
            addViolation(file, lineNum, line, 'ADV-007', 'MEDIUM', 'Renderiza RegistrySection dentro de si')
        }
        if (line.includes('<RegistryMain')) {
            addViolation(file, lineNum, line, 'ADV-007', 'MEDIUM', 'Renderiza RegistryMain dentro de si')
        }
    })
}

const report = {
    generated_at: new Date().toISOString(),
    scope: "advanced",
    summary: {
        total_violations: violations.length,
        by_severity: {
            HIGH: highCount,
            MEDIUM: mediumCount,
            LOW: lowCount
        },
        by_layer: {
            advanced: violations.length
        }
    },
    violations: violations
}

fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
console.log(`Audit complete. Found ${violations.length} violations in advanced layer.`)
