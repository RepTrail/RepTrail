
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function diagnostic() {
    console.log("Checking assignments for students...")

    // Get all students
    const { data: students } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('role', 'student')

    if (!students) {
        console.log("No students found.")
        return
    }

    for (const student of students) {
        console.log(`\nStudent: ${student.full_name} (${student.email}) [${student.id}]`)

        const { data: assignments } = await supabase
            .from('assigned_diets')
            .select(`
                id, active, diet_id,
                diet:diets(
                    id, name,
                    meals(
                        id, name,
                        meal_items(id, food_name)
                    )
                )
            `)
            .eq('student_id', student.id)

        if (!assignments || assignments.length === 0) {
            console.log("  No diet assignments found.")
        } else {
            for (const ass of assignments) {
                console.log(`  Assignment ID: ${ass.id} | Diet: ${ass.diet?.name} | Active: ${ass.active}`)
                console.log(`  Meals found: ${ass.diet?.meals?.length || 0}`)
                if (ass.diet?.meals) {
                    for (const meal of ass.diet.meals) {
                        console.log(`    - Meal: ${meal.name} (${meal.meal_items?.length || 0} items)`)
                    }
                }
            }
        }
    }
}

diagnostic()
