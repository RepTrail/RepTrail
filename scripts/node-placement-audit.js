const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const advancedDir = path.join(__dirname, '../src/components/store/advanced');
const outputFile = path.join(__dirname, 'component-placement-report.json');

function uuidv4() {
    return crypto.randomUUID();
}

function analyzeComponent(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const basename = path.basename(filePath);

    const isTest = basename.endsWith('.test.tsx') || basename.endsWith('.spec.tsx');
    if (isTest) return null;

    let scoreAdvanced = 0;
    let scoreInter = 0;
    let scoreBase = 0;
    const reasons = [];

    // 1. Hooks de negócio (não React)
    const hookMatches = content.match(/use[A-Z][a-zA-Z0-9]+/g) || [];
    const ignoredHooks = ['useState', 'useEffect', 'useRef', 'useCallback', 'useMemo', 'useId', 'useContext', 'useTransition'];
    const businessHooks = hookMatches.filter(h => !ignoredHooks.includes(h));
    
    if (businessHooks.length > 0) {
        scoreAdvanced += 3;
        reasons.push(`Usa hook(s) de dados/negócio: ${[...new Set(businessHooks)].join(', ')}`);
    }

    // 2. Props ou tipos com entidades de negócio
    const businessEntities = ['Workout', 'Student', 'Trainer', 'Profile', 'Exercise', 'Plan', 'Payment', 'Checkout'];
    const foundEntities = businessEntities.filter(e => content.includes(e));
    if (foundEntities.length > 0) {
        scoreAdvanced += 2;
        reasons.push(`Lida com entidades de domínio: ${foundEntities.join(', ')}`);
    }

    // 3. Lógica de negócio literal (isPremium, slug, etc)
    const logicKeywords = ['isPremium', 'isElite', 'plan_tier', 'elite_until', 'role ==', 'role ===', 'slug', 'cents', 'price', 'isActive', 'status'];
    const foundLogic = logicKeywords.filter(k => content.includes(k));
    if (foundLogic.length > 0) {
        scoreAdvanced += 3;
        reasons.push(`Lógica condicional de domínio: ${foundLogic.join(', ')}`);
    }

    // 4. Imports de outras camadas
    const importIntermediary = (content.match(/intermediary\//g) || []).length;
    const importAdvanced = (content.match(/advanced\//g) || []).length;
    const importBase = (content.match(/base\//g) || []).length;

    if (importAdvanced > 0) {
        scoreAdvanced += 3;
        reasons.push(`Importa ${importAdvanced} outros advanced components`);
    }

    if (importIntermediary >= 3) {
        scoreAdvanced += 2;
        reasons.push(`Importa múltiplos (${importIntermediary}) intermediaries`);
    } else if (importIntermediary > 0) {
        scoreInter += 1;
    }

    // Se só importa 1-2 base e NADA de intermediary/advanced
    if (importAdvanced === 0 && importIntermediary === 0 && importBase > 0 && importBase <= 3) {
        scoreInter += 2;
        reasons.push('Compõe apenas 1-3 componentes base de forma isolada');
    }

    // 5. Usa className?
    if (content.includes('className=')) {
        scoreBase += 3;
        reasons.push('Usa className (deveria estar em base ou encapsulado)');
    }

    // 6. Tem estado local?
    if (content.includes('useState(') || content.includes('useReducer(')) {
        scoreInter += 1;
        scoreAdvanced += 1;
        reasons.push('Gerencia estado interno');
    }

    // 7. Avaliar camada recomendada
    let recommendedLayer = 'advanced';
    let violation = null;
    let confidence = 0;

    const totalScore = scoreAdvanced + scoreInter + scoreBase || 1;

    // A regra para estar em advanced é: precisa ter negócio, hooks de negócio, ou compor muitos components complexos
    if (scoreAdvanced < 3 && scoreInter > scoreAdvanced) {
        recommendedLayer = 'intermediary';
        violation = 'PLC-002'; // Advanced que é composição simples
        confidence = scoreInter / totalScore;
    } else if (scoreAdvanced < 3 && scoreBase >= 3 && scoreInter === 0) {
        recommendedLayer = 'base';
        violation = 'PLC-002'; // Ou PLC-004
        confidence = scoreBase / totalScore;
    } else if (scoreAdvanced < 3 && scoreInter === 0 && scoreBase === 0 && businessHooks.length === 0 && foundLogic.length === 0) {
        recommendedLayer = 'intermediary';
        violation = 'PLC-004'; // Wrapper visual sem negócio
        confidence = 0.8;
    }

    return {
        basename,
        filePath,
        scoreAdvanced,
        scoreInter,
        scoreBase,
        violation,
        recommendedLayer,
        confidence: Math.min(confidence, 1).toFixed(2),
        reasons
    };
}

function runAudit() {
    console.log("Starting Component Placement Audit in advanced/...");
    const files = fs.readdirSync(advancedDir);
    const results = [];

    for (const file of files) {
        if (!file.endsWith('.tsx')) continue;
        const fullPath = path.join(advancedDir, file);
        const analysis = analyzeComponent(fullPath);
        if (analysis) {
            results.push(analysis);
        }
    }

    const misplaced = results.filter(r => r.violation !== null);
    const correct = results.filter(r => r.violation === null);

    const by_violation = {};
    const violations = misplaced.map(m => {
        by_violation[m.violation] = (by_violation[m.violation] || 0) + 1;
        return {
            id: uuidv4(),
            violation: m.violation,
            component: m.basename.replace('.tsx', ''),
            current_layer: "advanced",
            recommended_layer: m.recommendedLayer,
            confidence: parseFloat(m.confidence),
            reason: m.reasons,
            file: `src/components/store/advanced/${m.basename}`,
            fixed: false
        };
    });

    const report = {
        generated_at: new Date().toISOString(),
        summary: {
            analyzed: results.length,
            correct: correct.length,
            misplaced: misplaced.length,
            by_violation: by_violation
        },
        violations: violations
    };

    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
    console.log(`Audit complete. Analyzed ${results.length} files.`);
    console.log(`Found ${misplaced.length} misplaced components.`);
    console.log(`Report saved to ${outputFile}`);
}

runAudit();
