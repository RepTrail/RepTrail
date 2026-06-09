const fs = require('fs');
const path = require('path');

const advDir = path.join(__dirname, '../src/components/store/advanced');

function processFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Check if it uses RegistrySection
    if (!content.includes('<RegistrySection')) {
        return;
    }

    console.log('Processing', path.basename(filePath));

    // Remove import
    if (content.includes('import { RegistrySection }')) {
        content = content.replace(/import\s+\{\s*RegistrySection\s*\}\s+from\s+['"].\/registry-section['"];?\n?/g, '');
        content = content.replace(/import\s+\{\s*RegistrySection\s*\}\s+from\s+['"]@\/components\/store\/advanced\/registry-section['"];?\n?/g, '');
        hasChanges = true;
    }

    // Add necessary base imports if they don't exist
    if (!content.includes('import { Stack }')) {
        content = `import { Stack } from '@/components/store/base/stack'\n` + content;
    }
    if (!content.includes('import { Font }')) {
        content = `import { Font } from '@/components/store/base/font'\n` + content;
    }
    if (!content.includes('import { Inline }')) {
        content = `import { Inline } from '@/components/store/base/layout'\n` + content;
    }
    if (!content.includes('import { Icon }')) {
        content = `import { Icon } from '@/components/store/base/icon'\n` + content;
    }

    // Replace <RegistrySection ...> with <Stack>
    const openTagRegex = /<RegistrySection([\s\S]*?)>/g;
    
    content = content.replace(openTagRegex, (match, propsString) => {
        const titleMatch = propsString.match(/title=(?:"([^"]+)"|\{([^}]+)\})/);
        const iconMatch = propsString.match(/icon=\{([^}]+)\}/);
        const subtitleMatch = propsString.match(/subtitle=(?:"([^"]+)"|\{([^}]+)\})/);

        const title = titleMatch ? (titleMatch[1] ? `"${titleMatch[1]}"` : `{${titleMatch[2]}}`) : '"Section"';
        const icon = iconMatch ? iconMatch[1] : 'LayoutDashboard';
        const subtitleStr = subtitleMatch ? (subtitleMatch[1] ? `"${subtitleMatch[1]}"` : `{${subtitleMatch[2]}}`) : null;

        const sub = subtitleStr ? `{${subtitleStr} && <Font variant="description" color={STORE_TOKENS.COLORS.TEXT.MUTED}>{${subtitleStr}}</Font>}` : '';
        return `<Stack gap={STORE_TOKENS.SPACING.TITLE_CONTENT} fullWidth>
            <Stack direction={{ base: 'col', lg: 'row' }} justify="between" align={{ base: 'stretch', lg: 'end' }} gap={STORE_TOKENS.SPACING.CONTAINER}>
                <Stack gap={STORE_TOKENS.SPACING.ELEMENT}>
                    <Inline gap={STORE_TOKENS.SPACING.ELEMENT} align="center">
                        <Icon icon={${icon}} color={STORE_TOKENS.COLORS.BRAND as any} size="lg" />
                        <Font variant="heading" weight="black" uppercase italic color={STORE_TOKENS.COLORS.TEXT.PRIMARY}>{${title}}</Font>
                    </Inline>
                    ${sub}
                </Stack>
            </Stack>
            <Stack gap={STORE_TOKENS.SPACING.ELEMENT} fullWidth>`;
    });

    // Handle closing tag
    if (content.includes('</RegistrySection>')) {
        content = content.replace(/<\/RegistrySection>/g, '  </Stack>\n        </Stack>');
    }

    if (hasChanges) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else {
            processFile(fullPath);
        }
    });
}

walkDir(advDir);
console.log('ADV-007 fix applied to advanced components.');
