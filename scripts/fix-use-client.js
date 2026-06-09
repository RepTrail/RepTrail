const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

let count = 0;
const dirsToScan = ['./src/components', './src/app'];

dirsToScan.forEach(dir => {
    walkDir(dir, function(filePath) {
        if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
        
        let content = fs.readFileSync(filePath, 'utf8');
        // Match 'use client' or "use client" with optional semicolon
        const useClientRegex = /^\s*['"]use client['"][;]?\s*$/m;
        
        if (useClientRegex.test(content)) {
            const lines = content.split('\n');
            const index = lines.findIndex(line => line.match(/^\s*['"]use client['"][;]?\s*$/));
            
            if (index > 0) {
                // Check if there are imports or other code before it
                const beforeLines = lines.slice(0, index);
                const hasCodeBefore = beforeLines.some(line => {
                    const trimmed = line.trim();
                    return trimmed.length > 0 && !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.startsWith('*');
                });
                
                if (hasCodeBefore) {
                    // Remove the line where it was
                    lines.splice(index, 1);
                    // Insert at the top
                    lines.unshift("'use client'");
                    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
                    console.log(`Fixed: ${filePath}`);
                    count++;
                }
            }
        }
    });
});

console.log(`Fixed ${count} files.`);
