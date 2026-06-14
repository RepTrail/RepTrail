const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sectionsDir = path.join(__dirname, '../src/components/store/sections');
const outputFile = path.join(__dirname, 'audit-sections-report.json');

function uuidv4() {
    return crypto.randomUUID();
}

const allowedGaps = ['5', '2.5', '12', '12.5', '1', '0', '7.5', '10', '15', '20'];

function analyzeSection(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const basename = path.basename(filePath);
    const violations = [];

    let insideReturn = false;
    let baseComponentsCount = 0;

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // SEC-003: Usa className
        if (line.includes('className=')) {
            violations.push({
                id: uuidv4(),
                rule_id: "SEC-003",
                severity: "MEDIUM",
                layer: "sections",
                file: `src/components/store/sections/${basename}`,
                line: lineNum,
                description: "Uso proibido de className em sections (deve ser transferido para base/)",
                snippet: line.trim(),
                fixed: false
            });
        }

        // SEC-004: Usa props de layout proibidas
        const paddingMatch = line.match(/padding=\{([0-9]+)\}/);
        if (paddingMatch && paddingMatch[1] && !['0', '1', '2.5', '5', '10', '12', '15', '20'].includes(paddingMatch[1])) {
            violations.push({
                id: uuidv4(),
                rule_id: "SEC-004",
                severity: "LOW",
                layer: "sections",
                file: `src/components/store/sections/${basename}`,
                line: lineNum,
                description: `Prop de padding com valor não padronizado ou numérico fixo: ${paddingMatch[1]}`,
                snippet: line.trim(),
                fixed: false
            });
        }
        
        const widthMatch = line.match(/width="([0-9]+px)"|width=\{([0-9]+)\}/);
        if (widthMatch) {
            violations.push({
                id: uuidv4(),
                rule_id: "SEC-004",
                severity: "MEDIUM",
                layer: "sections",
                file: `src/components/store/sections/${basename}`,
                line: lineNum,
                description: "Uso de largura fixa absoluta (ex: width=\"320px\") não suportada por tokens",
                snippet: line.trim(),
                fixed: false
            });
        }

        // SEC-005: Renderiza outro RegistryMain ou RegistrySection
        if (line.includes('<RegistryMain') || line.includes('<RegistrySection')) {
            violations.push({
                id: uuidv4(),
                rule_id: "SEC-005",
                severity: "HIGH",
                layer: "sections",
                file: `src/components/store/sections/${basename}`,
                line: lineNum,
                description: "Renderiza um RegistryMain ou RegistrySection dentro de si (somente page.tsx deve orquestrá-los)",
                snippet: line.trim(),
                fixed: false
            });
        }

        // SEC-006: Usa gap proibido
        const gapMatch = line.match(/gap=\{([0-9.]+)\}/);
        if (gapMatch && !allowedGaps.includes(gapMatch[1])) {
            violations.push({
                id: uuidv4(),
                rule_id: "SEC-006",
                severity: "LOW",
                layer: "sections",
                file: `src/components/store/sections/${basename}`,
                line: lineNum,
                description: `Uso de gap proibido: gap={${gapMatch[1]}}`,
                snippet: line.trim(),
                fixed: false
            });
        }

        // SEC-001/SEC-002: Montagem inline
        if (line.includes('<Box') || line.includes('<Stack') || line.includes('<Inline') || line.includes('<Font')) {
            baseComponentsCount++;
        }
    });

    if (baseComponentsCount > 10) {
         violations.push({
            id: uuidv4(),
            rule_id: "SEC-001",
            severity: "MEDIUM",
            layer: "sections",
            file: `src/components/store/sections/${basename}`,
            line: 1,
            description: "Composição excessiva de primitives (base/intermediary) soltos. Provavelmente um ou mais organismos inline deveriam ser extraídos para advanced/",
            snippet: "Múltiplas tags <Box>, <Font>, <Stack> encontradas no arquivo.",
            fixed: false
        });
    }

    return violations;
}

function processDir(dir) {
    const items = fs.readdirSync(dir);
    let allViolations = [];
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            allViolations = allViolations.concat(processDir(fullPath));
        } else if (fullPath.endsWith('.tsx')) {
            allViolations = allViolations.concat(analyzeSection(fullPath));
        }
    }
    return allViolations;
}

console.log("Iniciando auditoria da camada sections/...");
const violations = processDir(sectionsDir);

const severityCount = { HIGH: 0, MEDIUM: 0, LOW: 0 };
violations.forEach(v => {
    if (severityCount[v.severity] !== undefined) {
        severityCount[v.severity]++;
    }
});

const report = {
    generated_at: new Date().toISOString(),
    scope: "sections",
    summary: {
        total_violations: violations.length,
        by_severity: severityCount,
        by_layer: { sections: violations.length }
    },
    violations
};

fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
console.log(`Auditoria concluída. ${violations.length} violações encontradas.`);
console.log(`Relatório salvo em: ${outputFile}`);
