const fs = require('fs')
const path = require('path')

const ROOT = './src'

function walk(dir) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
        const full = path.join(dir, file)

        if (fs.statSync(full).isDirectory()) {
            walk(full)
        } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
            processFile(full)
        }
    }
}

function processFile(file) {
    let content = fs.readFileSync(file, 'utf8')

    const original = content

    // 🚨 detect awaits perigosos
    content = content.replace(
        /await\s+(create|update|delete|assign|toggle)[A-Za-z0-9_]*/g,
        (match) => `/* ❌ OUTBOX VIOLATION */ ${match}`
    )

    // 🚨 detect useMutation
    content = content.replace(
        /useMutation\s*\(/g,
        '/* ❌ OUTBOX VIOLATION */ useMutation('
    )

    // 🚨 detect disabled isPending
    content = content.replace(
        /disabled=\{(isPending|loading)\}/g,
        '/* ❌ UI BLOCKING REMOVED */ disabled={false}'
    )

    if (content !== original) {
        fs.writeFileSync(file, content)
        console.log('UPDATED:', file)
    }
}

walk(ROOT)