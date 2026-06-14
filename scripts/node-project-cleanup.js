const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = path.join(__dirname, '../src/components/store');
const outputFile = path.join(__dirname, 'cleanup-report.json');

function runAudit() {
    console.log("Iniciando auditoria CLEAN-2 com Knip (Análise de AST/TypeScript)...");
    console.log("Isso pode levar alguns segundos...");

    let knipOutput = '';
    try {
        // Run knip and capture JSON output
        knipOutput = execSync('npx knip --reporter json', { 
            cwd: path.join(__dirname, '..'),
            encoding: 'utf8',
            maxBuffer: 1024 * 1024 * 10 // 10MB buffer just in case
        });
    } catch (error) {
        // Knip exits with code 1 if it finds unused files/exports, which throws an error in execSync
        // The output is still available in error.stdout
        if (error.stdout) {
            knipOutput = error.stdout;
        } else {
            console.error("Falha ao rodar o Knip:", error.message);
            return;
        }
    }

    try {
        // Parse the JSON output
        const parsed = JSON.parse(knipOutput);
        
        // Knip reports 'files' (unused files) and 'exports' (unused exports)
        // We are interested in files inside src/components/store/ that are completely unused
        const allUnusedFiles = parsed.files || [];
        const allUnusedExports = parsed.exports || [];

        // Filter files that are in our target directory
        const clean2Candidates = allUnusedFiles.filter(file => {
            // file path is usually relative to project root
            const normalizedPath = file.replace(/\\/g, '/');
            return normalizedPath.includes('src/components/store/');
        });

        // Also check if any file in target directory has ALL its exports unused
        // Note: Knip lists unused exports by file. If all exports of a file are unused, 
        // it might not be in 'files' but in 'exports'. For safety, we only take full unused files.

        const report = {
            generated_at: new Date().toISOString(),
            scope_directory: "src/components/store/",
            tool: "knip (AST parser)",
            summary: {
                total_clean2_candidates: clean2Candidates.length
            },
            clean2_candidates: clean2Candidates
        };
        
        fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
        console.log(`Auditoria concluída com precisão AST. ${clean2Candidates.length} candidatos CLEAN-2 encontrados.`);
        console.log(`Relatório salvo em: ${outputFile}`);
        
    } catch (parseError) {
        console.error("Erro ao fazer parse do resultado do Knip:", parseError);
        console.error("Output puro:", knipOutput.substring(0, 500) + '...');
    }
}

runAudit();
