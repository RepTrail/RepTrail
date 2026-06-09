import { DietBuilderSmart } from "@/components/store/advanced/diet-builder-smart"
import { Box } from "@/components/store/base/box"

interface TrainerDietBuilderSectionProps {
    diet: any
    students: any[]
}

export function TrainerDietBuilderSection({ diet, students }: TrainerDietBuilderSectionProps) {
    return (
        <Box fullWidth>
            <DietBuilderSmart
                diet={diet}
                students={students}
                contextLabel="ÁREA DO PERSONAL"
                icon="Utensils"
                contextColor="emerald"
            />
        </Box>
    )
}
