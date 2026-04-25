
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function diagnostic() {
    console.log("--- SYSTEM DIAGNOSTIC ---")

    // 1. Check trainer_students links
    const { data: links } = await supabase
        .from('trainer_students')
        .select('*, trainer:profiles!trainer_id(full_name), student:profiles!student_id(full_name, email)')

    console.log("\n1. TRAINER_STUDENTS LINKS:")
    if (!links || links.length === 0) {
        console.log("   No links found.")
    } else {
        links.forEach(l => {
            console.log(`   [${l.id}] Trainer: ${l.trainer?.full_name} -> Student: ${l.student?.full_name} (${l.student?.email}) [SID: ${l.student_id}]`)
        })
    }

    // 2. Check ALL assigned_diets
    const { data: allAssignments } = await supabase
        .from('assigned_diets')
        .select('*, diet:diets(name)')

    console.log("\n2. ALL DIET ASSIGNMENTS:")
    if (!allAssignments || allAssignments.length === 0) {
        console.log("   No assignments found in the entire table.")
    } else {
        allAssignments.forEach(a => {
            console.log(`   [${a.id}] Student ID: ${a.student_id} | Diet: ${a.diet?.name} | Active: ${a.active}`)
        })
    }

    // 3. Check for any diets created
    const { data: allDiets } = await supabase
        .from('diets')
        .select('id, name, trainer_id')

    console.log("\n3. ALL DIETS IN SYSTEM:")
    if (!allDiets || allDiets.length === 0) {
        console.log("   No diets found.")
    } else {
        allDiets.forEach(d => {
            console.log(`   [${d.id}] Name: ${d.name} | Trainer ID: ${d.trainer_id}`)
        })
    }
}

diagnostic().catch(console.error)
