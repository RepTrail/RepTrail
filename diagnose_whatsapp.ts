
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS

async function diagnoseStudent(studentId: string) {
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('--- Diagnosing Student Profile ---')
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', studentId)
        .single()

    if (error) {
        console.error('Error fetching profile:', error)
        return
    }

    console.log('Profile keys:', Object.keys(data))
    console.log('WhatsApp value:', data.whatsapp)
    console.log('Full Name:', data.full_name)
    console.log('Role:', data.role)
    console.log('--- End Diagnosis ---')
}

// Get the student ID from the URL in the context: /dashboard/trainer/students/[id]
// But wait, the [id] in the trainer/students/[id] is usually the relationship ID.
// Let's check the relationship first to get the student_id.

async function diagnoseRelationship(relationshipId: string) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data, error } = await supabase
        .from('trainer_students')
        .select('*, student:profiles!student_id(*)')
        .eq('id', relationshipId)
        .single()

    if (error) {
        console.error('Error fetching relationship:', error)
        return
    }

    console.log('Relationship Data:', {
        id: data.id,
        trainer_id: data.trainer_id,
        student_id: data.student_id
    })
    console.log('Student Profile Data:', data.student)
}

const targetId = 'a1262d29-4595-4fb2-bb20-94d320be471f' // Taking this from previous logs if possible or just as a placeholder
// Wait, I should probably just use the ID from the current page if I knew it.
// Since I don't know the exact ID being tested, I'll try to find any active relationship.

async function findAnyRelationship() {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data } = await supabase.from('trainer_students').select('id').limit(1).single()
    if (data) {
        console.log('Found relationship ID:', data.id)
        await diagnoseRelationship(data.id)
    }
}

findAnyRelationship()
