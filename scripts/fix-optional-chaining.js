const fs = require('fs');
const path = require('path');
const r = require('./schema-mismatch-report.json');

const files = [...new Set(r.mismatches.filter(m => m.type === 'MISMATCH-003').map(m => m.file))];
const nullableFields = ['full_name', 'body_fat', 'height', 'starting_weight', 'goal', 'activity_level', 'description', 'monthly_fee', 'elite_until'];

let fixedCount = 0;

files.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) return;
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    nullableFields.forEach(field => {
        // Substitui var.campo por var?.campo (quando antecedido por letra ou numero)
        const regex = new RegExp(`([a-zA-Z0-9_])\\.${field}\\b`, 'g');
        if (regex.test(content)) {
            content = content.replace(regex, `$1?.${field}`);
            modified = true;
        }
    });
    
    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`[FIXED] Optional chaining em: ${file}`);
        fixedCount++;
    }
});

console.log(`Total de arquivos corrigidos (Fase 1): ${fixedCount}`);
