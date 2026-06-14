const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, '../src');
const intermediaryDir = path.join(basePath, 'components/store/intermediary');
const advancedDir = path.join(basePath, 'components/store/advanced');

const filesToMove = [
    "protocol-card.tsx",
    "cardio-timer-card.tsx",
    "affiliate-list-item.tsx",
    "affiliate-wallet-summary.tsx",
    "commission-item.tsx",
    "withdrawal-item.tsx",
    "operational-cost-form.tsx",
    "ergogenic-card-premium.tsx",
    "ergogenic-student-hub-card.tsx",
    "ergogenics-list.tsx",
    "workout-card-premium.tsx",
    "management-card-premium.tsx",
    "log-actionable-card.tsx",
    "log-item.tsx",
    "user-list-item.tsx",
    "sidebar-profile.tsx",
    "trainer-profile-gamification-card.tsx",
    "ranking-podium-card.tsx",
    "ranking-list-item.tsx",
    "assigned-student-mini-card.tsx",
    "product-card.tsx",
    "store-product-card.tsx",
    "store-hero-card.tsx",
    "community-feed-card.tsx",
    "student-dashboard-header.tsx",
    "domain-step-card.tsx"
];

console.log("Moving files...");
filesToMove.forEach(file => {
    const src = path.join(intermediaryDir, file);
    const dest = path.join(advancedDir, file);
    if (fs.existsSync(src)) {
        try {
            fs.renameSync(src, dest);
            console.log(`Moved: ${file}`);
        } catch (e) {
            console.error(`Failed to move ${file}:`, e.message);
        }
    } else {
        console.log(`Skipped (not found): ${file}`);
    }
});

console.log("Updating imports...");
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
                    const oldImport1 = `intermediary/${baseName}`;
                    const newImport1 = `advanced/${baseName}`;
                    const oldImport2 = `intermediary/${baseName}'`;
                    const newImport2 = `advanced/${baseName}'`;
                    const oldImport3 = `intermediary/${baseName}"`;
                    const newImport3 = `advanced/${baseName}"`;
                    
                    if (content.includes(oldImport1)) {
                        content = content.split(oldImport1).join(newImport1);
                        modified = true;
                    }
                });
                
                if (modified) {
                    fs.writeFileSync(fullPath, content, 'utf8');
                    console.log(`Updated imports in: ${item}`);
                }
            } catch (e) {
                console.error(`Error processing file ${item}:`, e.message);
            }
        }
    }
}

processDir(basePath);
console.log("Done!");
