const fs = require('fs');
const path = require('path');

const advDir = path.join(__dirname, '../src/components/store/advanced');

function fixTruthy(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            fixTruthy(fullPath);
        } else if (fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Match {"Text" && <Font...>{"Text"}</Font>} and replace with <Font...>{"Text"}</Font>
            const regex = /\{"([^"]+)"\s*&&\s*(<Font[^>]*>\{"\1"\}<\/Font>)\}/g;
            let newContent = content.replace(regex, '$2');
            
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log(`Fixed truthy expression in ${fullPath}`);
            }
        }
    }
}

fixTruthy(advDir);
console.log('Done fixing truthy expressions.');
