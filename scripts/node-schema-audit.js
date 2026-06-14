const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const srcDir = path.join(__dirname, '../src');
const outputFile = path.join(__dirname, 'schema-mismatch-report.json');

const VALID_TABLES = new Set([
    'profiles', 'student_details', 'workouts', 'workout_exercises',
    'exercises', 'trainer_students', 'assigned_workouts', 'workout_logs',
    'daily_tracking', 'bf_history', 'weight_history', 'progress_photos',
    'affiliate_commissions', 'affiliate_payouts', 'affiliate_clicks',
    'trainer_reviews', 'app_settings', 'push_subscriptions', 'plan_features',
    'store_products', 'product_clicks', 'admin_logs', 'cardio_logs', 'cardio_sessions',
    'cardios', 'assigned_cardios', 'diets', 'assigned_diets', 'meal_item_logs',
    'ergogenics', 'assigned_ergogenics', 'ergogenic_logs', 'operational_costs',
    'plans', 'plan_features_dynamic', 'notifications', 'outbox', 'ai_protocol_status',
    'metrics_summary', 'load_history', 'pdf_uploads', 'store-products', 'avatars', 'progress-photos', 'pdf-uploads'
]);

function uuidv4() {
    return crypto.randomUUID();
}

function getAllFiles(dir, ext = '.ts', ext2 = '.tsx', fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, ext, ext2, fileList);
        } else if (filePath.endsWith(ext) || filePath.endsWith(ext2)) {
            fileList.push(filePath);
        }
    }
    return fileList;
}

function checkSchema() {
    console.log("Iniciando auditoria de schema do banco de dados em src/...");
    const files = getAllFiles(srcDir);
    const mismatches = [];

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');
        
        lines.forEach((line, index) => {
            const lineNum = index + 1;
            const relativePath = path.relative(path.join(__dirname, '..'), file);

            // MISMATCH-001: Invalid tables
            // Match: supabase.from('table_name')
            const tableMatch = line.match(/\.from\(['"]([^'"]+)['"]\)/);
            if (tableMatch) {
                const tableName = tableMatch[1];
                if (!VALID_TABLES.has(tableName)) {
                    mismatches.push({
                        id: uuidv4(),
                        type: 'MISMATCH-001',
                        severity: 'ALTA',
                        file: relativePath,
                        line: lineNum,
                        description: `Tabela '${tableName}' não existe nas 22 tabelas de referência.`,
                        snippet: line.trim(),
                        suggested_fix: "Verifique o nome correto da tabela.",
                        fixed: false
                    });
                }
            }

            // MISMATCH-002: Invalid fields
            // Checking common mistakes based on skill definition
            const invalidFields = [
                { wrong: 'workout_name', correct: 'name', table: 'workouts' },
                { wrong: 'created_by', correct: 'trainer_id', table: 'workouts' },
                { wrong: 'student_name', correct: 'full_name', table: 'profiles' },
                { wrong: 'user_role', correct: 'role', table: 'profiles' },
                { wrong: 'trainer_fee', correct: 'monthly_fee', table: 'trainer_students' },
                { wrong: 'student_count', correct: 'num_active_students', table: 'profiles' }
            ];

            invalidFields.forEach(field => {
                // If it looks like selecting or using the wrong field
                if (line.includes(`'${field.wrong}'`) || line.includes(`"${field.wrong}"`) || line.includes(`.${field.wrong}`)) {
                    mismatches.push({
                        id: uuidv4(),
                        type: 'MISMATCH-002',
                        severity: 'ALTA',
                        file: relativePath,
                        line: lineNum,
                        description: `Campo '${field.wrong}' não existe. Campo correto: '${field.correct}' na tabela '${field.table}'`,
                        snippet: line.trim(),
                        suggested_fix: `Substitua '${field.wrong}' por '${field.correct}'`,
                        fixed: false
                    });
                }
            });

            // MISMATCH-003: Nullable fields without guard
            // Searching for .full_name, .body_fat, etc without optional chaining
            const nullableFields = ['full_name', 'body_fat', 'height', 'starting_weight', 'goal', 'activity_level', 'description', 'monthly_fee', 'elite_until'];
            nullableFields.forEach(field => {
                // regex matches .field not preceded by ? and not followed by a quote (to avoid strings)
                const regex = new RegExp(`(?<!\\?)\\.${field}\\b`, 'g');
                if (regex.test(line) && !line.includes(`?.${field}`)) {
                    mismatches.push({
                        id: uuidv4(),
                        type: 'MISMATCH-003',
                        severity: 'MÉDIA',
                        file: relativePath,
                        line: lineNum,
                        description: `Campo nullable '${field}' acessado sem optional chaining (?.).`,
                        snippet: line.trim(),
                        suggested_fix: `Use optional chaining: '?.${field}'`,
                        fixed: false
                    });
                }
            });

            // MISMATCH-004: Incompatible types
            // day_of_week as string
            if (line.includes('day_of_week') && (line.includes("'monday'") || line.includes("'tuesday'"))) {
                mismatches.push({
                    id: uuidv4(),
                    type: 'MISMATCH-004',
                    severity: 'ALTA',
                    file: relativePath,
                    line: lineNum,
                    description: "Campo 'day_of_week' está sendo tratado como string (ex: 'monday'). Deve ser inteiro (0-6).",
                    snippet: line.trim(),
                    suggested_fix: "Mude para valor numérico, ex: 1 para segunda-feira.",
                    fixed: false
                });
            }

            // app_settings without eq('id', 1)
            if (line.includes("from('app_settings')") && !line.includes("eq('id', 1)")) {
                mismatches.push({
                    id: uuidv4(),
                    type: 'MISMATCH-004',
                    severity: 'ALTA',
                    file: relativePath,
                    line: lineNum,
                    description: "Busca em 'app_settings' sem filtro de ID único.",
                    snippet: line.trim(),
                    suggested_fix: "Adicione .eq('id', 1).single()",
                    fixed: false
                });
            }

            // MISMATCH-005: Manual triggers
            if (line.includes('num_active_students') && (line.includes('update') || line.includes('set'))) {
                mismatches.push({
                    id: uuidv4(),
                    type: 'MISMATCH-005',
                    severity: 'MÉDIA',
                    file: relativePath,
                    line: lineNum,
                    description: "Atualização manual de 'num_active_students'. Isso já é controlado por Trigger do banco.",
                    snippet: line.trim(),
                    suggested_fix: "Remova a atualização manual deste campo.",
                    fixed: false
                });
            }
        });
    });

    return mismatches;
}

function run() {
    const mismatches = checkSchema();
    
    const byType = {};
    const bySeverity = {};
    
    mismatches.forEach(m => {
        byType[m.type] = (byType[m.type] || 0) + 1;
        bySeverity[m.severity] = (bySeverity[m.severity] || 0) + 1;
    });

    const report = {
        generated_at: new Date().toISOString(),
        summary: {
            total_mismatches: mismatches.length,
            by_type: byType,
            by_severity: bySeverity
        },
        mismatches: mismatches
    };

    fs.writeFileSync(outputFile, JSON.stringify(report, null, 2));
    console.log(`Auditoria concluída. ${mismatches.length} divergências encontradas.`);
    console.log(`Relatório salvo em: ${outputFile}`);
}

run();
