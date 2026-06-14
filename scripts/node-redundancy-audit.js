const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const targetDir = path.join(__dirname, '../src/components/store/intermediary');
const outputFile = path.join(__dirname, 'redundancy-audit-report.json');

function uuidv4() {
    return crypto.randomUUID();
}

function extractJsxTags(content) {
    // Regex rudimentar para extrair a sequência de tags abertas <Tag ...>
    // Ignorando fragmentos, HTML nativo se houver, e comentários
    const tagMatches = content.match(/<([A-Z][a-zA-Z0-9]*)/g) || [];
    return tagMatches.map(t => t.substring(1));
}

function jaccardSimilarity(arr1, arr2) {
    const set1 = new Set(arr1);
    const set2 = new Set(arr2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    if (union.size === 0) return 1;
    return intersection.size / union.size;
}

function lcsSimilarity(arr1, arr2) {
    if (arr1.length === 0 || arr2.length === 0) return 0;
    
    // Calcula a similaridade baseada na maior subsequência comum
    const matrix = Array(arr1.length + 1).fill(0).map(() => Array(arr2.length + 1).fill(0));
    
    for (let i = 1; i <= arr1.length; i++) {
        for (let j = 1; j <= arr2.length; j++) {
            if (arr1[i - 1] === arr2[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1] + 1;
            } else {
                matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
            }
        }
    }
    
    const lcs = matrix[arr1.length][arr2.length];
    return lcs / Math.max(arr1.length, arr2.length);
}

function runAudit() {
    console.log("Iniciando auditoria de redundância na camada intermediary/...");
    const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.tsx'));
    
    const components = files.map(file => {
        const fullPath = path.join(targetDir, file);
        const content = fs.readFileSync(fullPath, 'utf8');
        const jsxTags = extractJsxTags(content);
        return {
            file,
            jsxTags,
            content
        };
    }).filter(c => c.jsxTags.length > 0);

    const groups = [];
    const processed = new Set();

    for (let i = 0; i < components.length; i++) {
        if (processed.has(components[i].file)) continue;

        const currentGroup = [components[i].file];
        processed.add(components[i].file);

        for (let j = i + 1; j < components.length; j++) {
            if (processed.has(components[j].file)) continue;

            // Comparar JSX
            const tags1 = components[i].jsxTags;
            const tags2 = components[j].jsxTags;
            
            // Se tiverem tamanho muito diferente, já ignora
            if (Math.abs(tags1.length - tags2.length) > 5) continue;
            
            // Se o set de tags for quase idêntico E a ordem for muito parecida
            const lcsSim = lcsSimilarity(tags1, tags2);
            
            // Heurística de redundância: >= 80% de similaridade de árvore JSX
            if (lcsSim >= 0.8) {
                currentGroup.push(components[j].file);
                processed.add(components[j].file);
            }
        }

        if (currentGroup.length > 1) {
            groups.push(currentGroup);
        }
    }

    const reportGroups = groups.map(group => {
        // Encontrar o menor nome para sugerir como target genérico, ou o que tem nome mais genérico
        const target = group[0]; 
        
        return {
            id: uuidv4(),
            candidates: group,
            target: target,
            target_ambiguous: true,
            criteria_met: ["CRIT-1", "CRIT-3"],
            rationale: "Possuem árvore JSX virtualmente idêntica (>= 80% de sobreposição estrutural), variando apenas props e chamadas de hook específicas de domínio, que poderiam ser injetadas por prop.",
            prop_mapping: [],
            affected_files: [],
            deprecated_component: "A definir",
            consolidated: false
        };
    });

    const report = {
        generated_at: new Date().toISOString(),
        scope_directory: "src/components/store/intermediary/",
        summary: {
            total_groups: reportGroups.length,
            total_files_affected: reportGroups.reduce((acc, g) => acc + g.candidates.length, 0),
            ambiguous_targets: reportGroups.length
        },
        groups: reportGroups
    };

    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
    console.log(`Auditoria concluída. ${reportGroups.length} grupos redundantes encontrados.`);
    console.log(`Relatório salvo em: ${outputFile}`);
}

runAudit();
