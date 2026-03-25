
import { adminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'

export class StudentService {
    static async getProfile(studentId: string) {
        return unstable_cache(
            async () => {
                const { data, error } = await adminClient
                    .from('profiles')
                    .select('*')
                    .eq('id', studentId)
                    .maybeSingle()

                if (error) {
                    console.error('Error in StudentService.getProfile:', error)
                    return null
                }
                return data
            },
            [`student-profile-${studentId}`],
            { tags: ['students', 'profiles', `profile-${studentId}`] }
        )()
    }

    static async getTrainer(studentId: string) {
        return unstable_cache(
            async () => {
                const { data, error } = await adminClient
                    .from('trainer_students')
                    .select(`
                        *,
                        trainer:profiles!trainer_id(*)
                    `)
                    .eq('student_id', studentId)
                    .eq('active', true)
                    .maybeSingle()

                if (error) {
                    console.error('Error in StudentService.getTrainer:', error)
                    return null
                }
                return data
            },
            [`student-trainer-${studentId}`],
            { tags: ['students', `trainer-link-${studentId}`] }
        )()
    }

    static async getDetails(studentId: string) {
        return unstable_cache(
            async () => {
                const { data, error } = await adminClient
                    .from('profiles')
                    .select(`
                        *,
                        enrollment:trainer_students!student_id(
                            trainer_id,
                            active,
                            created_at
                        )
                    `)
                    .eq('id', studentId)
                    .maybeSingle()

                if (error) {
                    console.error('Error in StudentService.getDetails:', error)
                    return null
                }
                return data
            },
            [`student-details-${studentId}`],
            { tags: ['students', `details-${studentId}`] }
        )()
    }
}
