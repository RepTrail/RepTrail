import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

function walk(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (let file of list) {
        let fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) walk(fullPath, files);
        else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) files.push(fullPath);
    }
    return files;
}

const files = walk(srcDir);

// Mapping from Windows-1252 to bytes
const win1252ToByte = new Map();
for (let i = 0; i < 128; i++) win1252ToByte.set(String.fromCharCode(i), i);
const cp1252Extra = [
    0x20AC, 0x0081, 0x201A, 0x0192, 0x201E, 0x2026, 0x2020, 0x2021, 
    0x02C6, 0x2030, 0x0160, 0x2039, 0x0152, 0x008D, 0x017D, 0x008F,
    0x0090, 0x2018, 0x2019, 0x201C, 0x201D, 0x2022, 0x2013, 0x2014, 
    0x02DC, 0x2122, 0x0161, 0x203A, 0x0153, 0x009D, 0x017E, 0x0178
];
for (let i = 0; i < 32; i++) win1252ToByte.set(String.fromCharCode(cp1252Extra[i]), 0x80 + i);
for (let i = 0xA0; i <= 0xFF; i++) win1252ToByte.set(String.fromCharCode(i), i);

function decodeCorruptedWord(word) {
    let bytes = [];
    for (let i = 0; i < word.length; i++) {
        let b = win1252ToByte.get(word[i]);
        if (b === undefined) return word; // Not a valid Win-1252 character, probably not corrupted this way
        bytes.push(b);
    }
    const decoded = Buffer.from(bytes).toString('utf8');
    // If decoding fails, it will contain the replacement character U+FFFD
    if (decoded.includes('\uFFFD')) return word;
    return decoded;
}

const pattern = /\b\w*Ã\w*\b/g;

// Fallback manual mappings for safety if regex bound misses something
const manualMap = {
    'Ã§': 'ç', 'Ã£': 'ã', 'Ã¡': 'á', 'Ã©': 'é', 'Ã³': 'ó', 'Ãº': 'ú',
    'ÃŠ': 'Ê', 'Ã¢': 'â', 'Ãª': 'ê', 'Ãµ': 'õ', 'Ã€': 'À', 'Ã‰': 'É',
    'Ã“': 'Ó', 'Ãš': 'Ú', 'Ã‡': 'Ç', 'Ãƒ': 'Ã', 'Ã•': 'Õ', 'Ã‚': 'Â',
    'ÃŽ': 'Î', 'Ã”': 'Ô', 'Ã›': 'Û', 'Ã¤': 'ä', 'Ã«': 'ë', 'Ã¯': 'ï',
    'Ã¶': 'ö', 'Ã¼': 'ü', 'ÃšBLICO': 'ÚBLICO', 'PÃŠBLICO': 'PÚBLICO',
    'aÃ§Ã£o': 'ação', 'aÃ§Ãµes': 'ações', 'substituiÃ§Ã£o': 'substituição',
    'descriÃ§Ã£o': 'descrição', 'configuraÃ§Ã£o': 'configuração',
    'AtenÃ§Ã£o': 'Atenção', 'geraÃ§Ã£o': 'geração', 'cÃ¡lculo': 'cálculo',
    'VocÃª': 'Você', 'mÃ¡xima': 'máxima', 'mÃ©tricas': 'métricas',
    'mediÃ§Ãµes': 'medições', 'crÃ­tico': 'crítico', 'disponÃ­vel': 'disponível',
    'indisponÃ­vel': 'indisponível', 'irreversÃ­vel': 'irreversível',
    'Ã©': 'é', 'serÃ¡': 'será', 'removerÃ¡': 'removerá', 'processarÃ¡': 'processará',
    'poderÃ¡': 'poderá', 'AleatÃ³ria': 'Aleatória', 'GÃŠNERO': 'GÊNERO',
    'BIOLÃ“GICO': 'BIOLÓGICO', 'SedentÃ¡rio': 'Sedentário', 'exercÃ­cio': 'exercício',
    'histÃ³rico': 'histórico', 'catÃ¡logo': 'catálogo', 'permanecerÃ£o': 'permanecerão',
    'nÃ£o': 'não', 'gestÃ£o': 'gestão', 'cobranÃ§a': 'cobrança', 'SaÃºde': 'Saúde',
    'MÃ¡xima': 'Máxima', 'AtribuiÃ§Ã£o': 'Atribuição', 'alteraÃ§Ãµes': 'alterações',
    'SubstituiÃ§Ã£o': 'Substituição', 'comeÃ§ar': 'começar', 'SolicitaÃ§Ã£o': 'Solicitação',
    'mÃ­nimo': 'mínimo', 'DisponÃ­vel': 'Disponível', 'AntropomÃ©tricas': 'Antropométricas',
    'PrecisÃ£o': 'Precisão', 'ConcluÃ­do': 'Concluído', 'sessÃ£o': 'sessão',
    'Ã\xad': 'í', 'Ã\x8d': 'Í', 'Ã\x89': 'É', 'Ã\x8a': 'Ê', 'Ã\x93': 'Ó', 'Ã\x9a': 'Ú',
    'PÃŠBLICO': 'PÚBLICO', 'PÃšBLICO': 'PÚBLICO'
};

let modifiedFiles = 0;

for (const file of files) {
    if (file.includes('pdf-parser-local.ts') || file.includes('pdf-post-processors.ts')) {
        continue; // Skip these as they contain intentional ÁÀÃÂ etc.
    }
    
    const originalContent = fs.readFileSync(file, 'utf8');
    let newContent = originalContent;
    
    // Pass 1: regex-based Win-1252 decode for whole words
    newContent = newContent.replace(/\b\w*Ã\w*\b/g, (match) => {
        const decoded = decodeCorruptedWord(match);
        return decoded;
    });
    
    // Pass 2: manual mapping for any leftover or tricky characters (like soft-hyphen combinations)
    for (const [corrupted, fixed] of Object.entries(manualMap)) {
        newContent = newContent.split(corrupted).join(fixed);
    }
    
    if (newContent !== originalContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log('Fixed:', file);
        modifiedFiles++;
    }
}

console.log('Total files fixed:', modifiedFiles);
