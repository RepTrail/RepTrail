export function validateImportCompatibility(type: 'workout' | 'diet', parsedData: any) {
    const isActuallyDiet = (parsedData?.parsed_data?.meals?.length > 0 || parsedData?.parsed_data?.options?.length > 0);
    const isActuallyWorkout = (parsedData?.parsed_data?.workouts?.length > 0 || parsedData?.parsed_data?.exercises?.length > 0);

    if (type === 'workout' && isActuallyDiet && !isActuallyWorkout) {
        return "Este PDF parece ser uma DIETA. Use a aba de Dieta para importar.";
    }
    if (type === 'diet' && isActuallyWorkout && !isActuallyDiet) {
        return "Este PDF parece ser um TREINO. Use a aba de Treino para importar.";
    }
    return null;
}
