
import { adminClient } from '@/lib/supabase/admin'
import { unstable_cache } from 'next/cache'

export class ErgogenicService {
    static async getAssignments(studentId: string) {
        return unstable_cache(
            async () => {
                const { data, error } = await adminClient
                    .from('assigned_ergogenics')
                    .select(`
                        *,
                        ergogenic:ergogenics(*)
                    `)
                    .eq('student_id', studentId)
                    .eq('active', true)

                if (error) {
                    console.error('Error in ErgogenicService.getAssignments:', error)
                    return []
                }
                return data || []
            },
            [`ergogenics-student-${studentId}`],
            { tags: ['ergogenics', `student-ergogenics-${studentId}`] }
        )()
    }

    static async getTodayLogs(studentId: string) {
        const today = new Date().toISOString().split('T')[0]
        return unstable_cache(
            async () => {
                const { data, error } = await adminClient
                    .from('ergogenic_logs')
                    .select('*')
                    .eq('student_id', studentId)
                    .eq('log_date', today)

                if (error) {
                    console.error('Error in ErgogenicService.getTodayLogs:', error)
                    return []
                }
                return data || []
            },
            [`ergogenics-logs-${studentId}-${today}`],
            { tags: ['ergogenics', `logs-${studentId}`] }
        )()
    }
}

export class CardioService {
    static async getAssignments(studentId: string) {
        return unstable_cache(
            async () => {
                const { data, error } = await adminClient
                    .from('assigned_cardios')
                    .select(`
                        *,
                        cardio:cardios(*)
                    `)
                    .eq('student_id', studentId)
                    .eq('active', true)

                if (error) {
                    console.error('Error in CardioService.getAssignments:', error)
                    return []
                }
                return data || []
            },
            [`cardio-student-${studentId}`],
            { tags: ['cardios', `student-cardio-${studentId}`] }
        )()
    }
}
