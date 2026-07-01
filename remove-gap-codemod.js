const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const targetDir = path.join(__dirname, 'src');
console.log(`Searching in: ${targetDir}`);
const files = walk(targetDir);
let changedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Procura tags <Button ...> ou <DSButton ...> (incluindo quebras de linha)
    const regex = /<(?:Button|DSButton)\b([^>]*?)>/g;
    
    const newContent = content.replace(regex, (match) => {
        // Remove gap={...} ou gap="..."
        let noGap = match.replace(/\s*gap=\{[^}]+\}/g, '');
        noGap = noGap.replace(/\s*gap="[^"]+"/g, '');
        return noGap;
    });

    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedCount++;
        console.log(`Limpo: ${path.basename(file)}`);
    }
});

console.log(`\n🚀 Finalizado! ${changedCount} arquivos foram corrigidos.`);
