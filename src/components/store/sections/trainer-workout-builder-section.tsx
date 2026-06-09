import { WorkoutBuilderSmart } from "@/components/store/advanced/workout-builder-smart"
import { Box } from "@/components/store/base/box"

interface TrainerWorkoutBuilderSectionProps {
    workout: any
    students: any[]
}

export function TrainerWorkoutBuilderSection({ workout, students }: TrainerWorkoutBuilderSectionProps) {
    return (
        <Box fullWidth>
            <WorkoutBuilderSmart 
                workout={workout} 
                students={students} 
                contextLabel="ÁREA DO PERSONAL"
                icon="Dumbbell"
                contextColor="emerald"
            />
        </Box>
    )
}
