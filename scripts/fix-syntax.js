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

const files = walk(path.join(__dirname, '..', 'src'));
let fixedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Fix 1: return ( sem <> em múltiplos elementos (heuristic: começa com <Componente e termina com ) mas tem elementos adjacentes)
    // Uma forma mais segura: procurar return (\n e se o próximo caracter não for <>, adicionar. Mas é arriscado.
    
    // Lista exata de substituições para os erros detectados:
    
    const replacements = [
        { find: 'return (\n        \n            <Script', replace: 'return (\n        <>\n            <Script' },
        { find: '</noscript>\n\n    )', replace: '</noscript>\n        </>\n    )' },
        { find: 'actions={\n                            \n                                <ActionIconButton', replace: 'actions={\n                            <>\n                                <ActionIconButton' },
        { find: '/>\n\n                            }', replace: '/>\n                            </>\n                            }' },
        { find: 'return (\n        \n            <Grid', replace: 'return (\n        <>\n            <Grid' },
        { find: '/>\n\n    );', replace: '/>\n        </>\n    );' },
        { find: 'return (\n        \n            <Stack', replace: 'return (\n        <>\n            <Stack' },
        { find: '/>\n\n    )', replace: '/>\n        </>\n    )' },
        { find: 'return (\n\n        <Box', replace: 'return (\n\n        <>\n        <Box' },
        { find: '        )\n    }\n        \n    )', replace: '        )\n    }\n        </>\n    )' },
        { find: 'return (\n\n        {/* Mobile Overlay */ }', replace: 'return (\n<>\n        {/* Mobile Overlay */ }' },
        { find: '</GlassPanel>\n    </Box >\n        \n    );', replace: '</GlassPanel>\n    </Box >\n        </>\n    );' },
        { find: 'actions={\n                        \n                            <ActionIconButton', replace: 'actions={\n                        <>\n                            <ActionIconButton' },
        { find: '/>\n\n                        }', replace: '/>\n                        </>\n                        }' },
        { find: 'return (\n        \n            <Surface', replace: 'return (\n        <>\n            <Surface' },
        { find: '</Surface>\n            \n        )', replace: '</Surface>\n        </>\n        )' },
        { find: 'return (\n        \n            {/* Desktop SideNav */ }', replace: 'return (\n        <>\n            {/* Desktop SideNav */ }' },
        { find: '</Box>\n        \n    );', replace: '</Box>\n        </>\n    );' },
        { find: 'return (\n        \n            <Badge', replace: 'return (\n        <>\n            <Badge' },
        { find: '/>\n\n    )', replace: '/>\n        </>\n    )' },
        { find: 'return (\n        \n            <Box', replace: 'return (\n        <>\n            <Box' },
        { find: '/>\n        \n    );', replace: '/>\n        </>\n    );' },
        { find: 'return (\n        \n            {showSplash &&', replace: 'return (\n        <>\n            {showSplash &&' },
        { find: '</RegistryProvider>\n    )', replace: '</RegistryProvider>\n        </>\n    )' },
        { find: 'return (\n        \n            <Inline', replace: 'return (\n        <>\n            <Inline' },
        { find: '</Inline>\n    )', replace: '</Inline>\n        </>\n    )' }
    ];

    replacements.forEach(rep => {
        // Multiplas vezes caso haja mais de um por arquivo
        let prev;
        do {
            prev = content;
            content = content.replace(rep.find, rep.replace);
        } while (content !== prev);
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`[FIXED] ${file}`);
        fixedFiles++;
    }
});

console.log(`Total de arquivos com sintaxe reparada (Fase 1): ${fixedFiles}`);
