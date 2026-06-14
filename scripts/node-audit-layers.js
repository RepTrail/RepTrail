const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = path.join(__dirname, '../src/components/store/intermediary');
const reportPath = path.join(__dirname, 'audit-intermediary-report.json');

const violations = [];
let highCount = 0;
let mediumCount = 0;
let lowCount = 0;

function walk(dirPath, callback) {
    fs.readdirSync(dirPath).forEach(f => {
        let dirPathFile = path.join(dirPath, f);
        let stat = fs.statSync(dirPathFile);
        if (stat && stat.isDirectory()) {
            walk(dirPathFile, callback);
        } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
            callback(dirPathFile);
        }
    });
}

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileName = path.relative(path.join(__dirname, '../'), filePath).replace(/\\/g, '/');

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const text = line.trim();

        // Exceções conhecidas e permitidas:
        // motion.div style={{...}}
        if (text.includes('style={{') && text.includes('wrapperStyle') === false && (lines[index - 1] && !lines[index-1].includes('motion.div')) && !text.includes('motion.div')) {
            violations.push({
                id: crypto.randomUUID(),
                rule_id: 'ADV-003',
                severity: 'MEDIUM',
                layer: 'advanced',
                file: fileName,
                line: lineNum,
                description: 'Uso de style inline (proibido)',
                snippet: text,
                fixed: false
            });
            mediumCount++;
        }

        if (text.includes('className=')) {
            violations.push({
                id: crypto.randomUUID(),
                rule_id: 'ADV-001',
                severity: 'HIGH',
                layer: 'advanced',
                file: fileName,
                line: lineNum,
                description: 'Uso de className direto fora de base',
                snippet: text,
                fixed: false
            });
            highCount++;
        }

        // mt, mb, ml, mr
        if (/\b(mt|mb|ml|mr)=/.test(text)) {
            violations.push({
                id: crypto.randomUUID(),
                rule_id: 'ADV-004',
                severity: 'LOW',
                layer: 'advanced',
                file: fileName,
                line: lineNum,
                description: 'Uso de mt, mb, ml, mr',
                snippet: text,
                fixed: false
            });
            lowCount++;
        }

        // width / height fixos (números ou strings com px/rem, excluindo tokens e 100% ou full)
        if (/(width|height)=\{(?!.*STORE_TOKENS)[0-9]+\}/.test(text) || /(width|height)=["'][0-9]+(px|rem|em)?["']/.test(text)) {
            if (!text.includes('100%')) {
                violations.push({
                    id: crypto.randomUUID(),
                    rule_id: 'ADV-005',
                    severity: 'LOW',
                    layer: 'advanced',
                    file: fileName,
                    line: lineNum,
                    description: 'Uso de width ou height fixos numéricos/px/rem',
                    snippet: text,
                    fixed: false
                });
                lowCount++;
            }
        }

        // gap proibido (números diretos sem token)
        if (/gap=\{[0-9]+\}/.test(text)) {
            violations.push({
                id: crypto.randomUUID(),
                rule_id: 'ADV-006',
                severity: 'LOW',
                layer: 'advanced',
                file: fileName,
                line: lineNum,
                description: 'Uso de gap numérico (deve usar token)',
                snippet: text,
                fixed: false
            });
            lowCount++;
        }

        // RegistrySection / RegistryMain
        if (text.includes('<RegistrySection') || text.includes('<RegistryMain')) {
            violations.push({
                id: crypto.randomUUID(),
                rule_id: 'ADV-007',
                severity: 'MEDIUM',
                layer: 'advanced',
                file: fileName,
                line: lineNum,
                description: 'Renderiza RegistrySection ou RegistryMain dentro de si',
                snippet: text,
                fixed: false
            });
            mediumCount++;
        }
    });
}

walk(dir, checkFile);

const report = {
    generated_at: new Date().toISOString(),
    scope: 'advanced',
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
    violations
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');
console.log(`Audit complete. Found ${violations.length} violations.`);
