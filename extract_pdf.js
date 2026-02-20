const fs = require('fs');
const path = require('path');
// Note: This script assumes pdf-parse is available or can be run via npx
// We will try to run this script using npx -p pdf-parse node extract_pdf.js

async function extract() {
    try {
        let pdf = require('pdf-parse');
        if (pdf.default) pdf = pdf.default;
        const folder = path.join('..', 'PDF pra converter em JSON e importar via sql');
        const files = [
            'PROT. DE DIETA GABRIEL ARAUJO.pdf + vol.pdf',
            'PROT. DE TREINAMENTO GABRIEL ARAUJO.pdf + vol.pdf'
        ];

        const results = {};

        for (const file of files) {
            const filePath = path.join(process.cwd(), folder, file);
            if (!fs.existsSync(filePath)) {
                console.error(`File not found: ${filePath}`);
                continue;
            }
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            results[file] = data.text;
            console.log(`Extracted ${file}`);
        }

        fs.writeFileSync('extracted_text.json', JSON.stringify(results, null, 2));
        console.log('Results saved to extracted_text.json');
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

extract();
