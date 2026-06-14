const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '../src');
const advancedDir = path.join(basePath, 'components/store/advanced');
const intermediaryDir = path.join(basePath, 'components/store/intermediary');

const filesToMove = [
    "auth-form-skeleton.tsx",
    "empty-state-404.tsx",
    "icon-label-button.tsx",
    "landing-section.tsx",
    "management-registry-section.tsx",
    "onboarding-logout-button.tsx"
];

console.log("Movendo os 6 arquivos de advanced/ para intermediary/...");
filesToMove.forEach(file => {
    const src = path.join(advancedDir, file);
    const dest = path.join(intermediaryDir, file);
    if (fs.existsSync(src)) {
        try {
            fs.renameSync(src, dest);
            console.log(`[OK] Movido: ${file}`);
        } catch (e) {
            console.error(`[ERRO] Falha ao mover ${file}:`, e.message);
        }
    } else {
        console.log(`[SKIP] Não encontrado (já movido?): ${file}`);
    }
});

console.log("\nAtualizando imports em todo o projeto...");
const baseNames = filesToMove.map(f => f.replace('.tsx', ''));

function processDir(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            try {
                let content = fs.readFileSync(fullPath, 'utf8');
                let modified = false;
                
                baseNames.forEach(baseName => {
                    // Padrão de import a ser buscado e substituído
                    const oldImport1 = `advanced/${baseName}`;
                    const newImport1 = `intermediary/${baseName}`;
                    
                    if (content.includes(oldImport1)) {
                        content = content.split(oldImport1).join(newImport1);
                        modified = true;
                    }
                });
                
                if (modified) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`[ATUALIZADO] Imports em: ${item}`);
                }
            } catch (e) {
                console.error(`[ERRO] Falha ao processar arquivo ${item}:`, e.message);
            }
        }
    }
}

processDir(basePath);
console.log("\n✅ Refatoração finalizada com sucesso!");
