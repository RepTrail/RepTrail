import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const sectionsDir = path.join(process.cwd(), 'src/components/store/sections');
const reportPath = path.join(process.cwd(), 'scripts/audit-layers-report.json');

const violations = [];

const rules = {
    'SEC-003': { severity: 'MEDIUM', test: (line) => line.includes('className=') },
    'SEC-004': { severity: 'LOW', test: (line) => /(?:padding|width|height)={?\s*(?:["']\d+px["']|\d+)\s*}?/.test(line) && !line.includes('padding={12}') },
    'SEC-005': { severity: 'HIGH', test: (line) => line.includes('<RegistryMain') || line.includes('<RegistrySection') },
    'SEC-006': { severity: 'LOW', test: (line) => /gap={([^}]+)}/.test(line) && !['0', '1', '2.5', '5', '12', '12.5'].includes(line.match(/gap={([^}]+)}/)?.[1]) }
};

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else if (file.endsWith('.tsx')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walkDir(sectionsDir);

files.forEach(filePath => {
    const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    // For SEC-001/SEC-002 (Inline components / Badge recreation)
    // We count `<Box` occurrences. If too many in a single file, it's a smell of SEC-001.
    const boxCount = lines.filter(l => l.includes('<Box')).length;
    if (boxCount > 10) {
        violations.push({
            id: randomUUID(),
            rule_id: 'SEC-001',
            severity: 'MEDIUM',
            layer: 'sections',
            file: relativePath,
            line: 1,
            description: `Muitas tags <Box> encontradas (${boxCount}). Possível montagem inline excessiva que deveria ser extraída para advanced.`,
            snippet: '...',
            fixed: false
        });
    }

    lines.forEach((line, idx) => {
        const lineNumber = idx + 1;
        
        for (const [ruleId, ruleDef] of Object.entries(rules)) {
            if (ruleDef.test(line)) {
                
                // Exceção: className pode ser apenas string no comentário
                if (ruleId === 'SEC-003' && (line.trim().startsWith('//') || line.trim().startsWith('*'))) continue;

                violations.push({
                    id: randomUUID(),
                    rule_id: ruleId,
                    severity: ruleDef.severity,
                    layer: 'sections',
                    file: relativePath,
                    line: lineNumber,
                    description: `Violação da regra ${ruleId}`,
                    snippet: line.trim(),
                    fixed: false
                });
            }
        }
    });
});

const report = {
    generated_at: new Date().toISOString(),
    scope: 'sections',
    summary: {
        total_violations: violations.length,
        by_severity: {
            HIGH: violations.filter(v => v.severity === 'HIGH').length,
            MEDIUM: violations.filter(v => v.severity === 'MEDIUM').length,
            LOW: violations.filter(v => v.severity === 'LOW').length,
        },
        by_layer: { sections: violations.length }
    },
    violations
};

fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`Auditoria completa. ${violations.length} violações encontradas. Relatório salvo em ${reportPath}`);
