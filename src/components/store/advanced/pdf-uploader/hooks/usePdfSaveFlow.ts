import { useMutation, useQueryClient } from '@/lib/dal';
import { useToast } from '@/hooks/use-toast';
import { saveParsedData } from '@/lib/dal/remote';
import { useTrainerOnboarding } from '@/hooks/use-trainer-onboarding';
import { QUERY_KEYS } from '@/lib/query-keys';
import { validateImportCompatibility } from '../lib/validators';
import { normalizeDays } from '@/lib/utils';

export function usePdfSaveFlow({ type, userId, role, initialStudentId, parsedData, setParsedData, selectionHooks, bindingHooks }: any) {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { step: onboardingStep, nextStep } = useTrainerOnboarding(userId, { activeStudents: 0, workoutsCount: 0, dietsCount: 0 });

    const { mutate: handleSaveFinal, isPending: isSaving } = useMutation({
        mutationFn: async (variables: any) => {
            return await saveParsedData(variables.type, variables.data, variables.studentId, variables.createPlaceholder);
        },
        onSuccess: (result, variables) => {
            if (result.error) {
                toast({ variant: "destructive", title: "Erro ao salvar", description: result.error });
                return;
            }

            setParsedData(null);
            bindingHooks.setSelectedStudentId(null);
            selectionHooks.setSelectedOptionIndex(0);

            setTimeout(() => {
                const sid = variables.studentId || (result as any).data?.placeholderId || (result as any).results?.placeholderId;
                queryClient.invalidateQueries({ queryKey: ['trainer', 'student'] });
                if (sid) {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ergogenics.all(sid) });
                    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.cardio.assignments(sid) });
                }
                queryClient.invalidateQueries({ queryKey: ['trainer'] });
                queryClient.invalidateQueries({ queryKey: ['workouts'] });
                queryClient.invalidateQueries({ queryKey: ['diets'] });
                queryClient.invalidateQueries({ queryKey: ['cardio'] });
                queryClient.invalidateQueries({ queryKey: ['ergogenics'] });
            }, 800);

            if (onboardingStep === 'import_diet') {
                nextStep('aha_moment');
                const ghostInfo = variables.createPlaceholder || { name: bindingHooks.detectedStudentName || 'Aluno' };
                localStorage.setItem(`onboarding_ghost_${userId}`, JSON.stringify(ghostInfo));
            }

            toast({ title: "✅ Plano importado com sucesso", description: `${type === 'workout' ? 'Treino' : 'Dieta'} processado e vinculado.` });
        },
        onSettled: () => setTimeout(() => queryClient.invalidateQueries(), 1000)
    });

    const handleSave = () => {
        if (role === 'trainer' && type === 'workout' && parsedData?.parsed_data?.ergogenics?.length > 0 && !bindingHooks.selectedStudentId) {
            toast({ variant: "destructive", title: "Atenção!", description: "Ergogênicos detectados. Selecione um aluno para salvar o protocolo." });
            return;
        }

        const compatibilityError = validateImportCompatibility(type, parsedData);
        if (compatibilityError) {
            toast({ variant: "destructive", title: "Arquivo Incompatível", description: compatibilityError });
            return;
        }

        if (role === 'trainer' && bindingHooks.bindingMode === 'create' && !bindingHooks.placeholderEmail) {
            toast({ variant: "destructive", title: "Atenção: Email não informado!", description: "Sem o email você não consegue enviar o acesso automaticamente." });
        }

        let dataToSave = { ...parsedData.parsed_data };

        if (dataToSave.cardios) {
            dataToSave.cardios = dataToSave.cardios
                .filter((_: any, i: number) => selectionHooks.selectedCardioIndices.has(i))
                .map((c: any) => ({ ...c, application_days: normalizeDays(c.application_days) }));
        }
        if (dataToSave.ergogenics) {
            dataToSave.ergogenics = dataToSave.ergogenics.filter((_: any, i: number) => selectionHooks.selectedErgoIndices.has(i));
        }

        if (type === 'diet' && parsedData.parsed_data?.options?.length > 0) {
            const selectedOption = parsedData.parsed_data.options[selectionHooks.selectedOptionIndex];
            dataToSave = {
                ...dataToSave,
                diet_name: selectedOption.name,
                meals: selectedOption.meals,
                days_of_week: (selectionHooks.selectedDietDays && selectionHooks.selectedDietDays.length > 0) ? selectionHooks.selectedDietDays : (role === 'student' ? [0, 1, 2, 3, 4, 5, 6] : []),
            };
            delete dataToSave.options;
        } else if (type === 'diet') {
            dataToSave = { ...dataToSave, days_of_week: normalizeDays(selectionHooks.selectedDietDays) };
        }

        let createPlaceholderObj = undefined;
        if (role === 'trainer' && bindingHooks.bindingMode === 'create' && !bindingHooks.selectedStudentId) {
            createPlaceholderObj = {
                name: bindingHooks.placeholderName || bindingHooks.detectedStudentName || "Novo Aluno",
                email: bindingHooks.placeholderEmail,
                whatsapp: bindingHooks.placeholderWhatsapp
            };
        }

        const finalStudentId = bindingHooks.selectedStudentId || initialStudentId;

        handleSaveFinal({
            type,
            data: dataToSave,
            studentId: finalStudentId || undefined,
            createPlaceholder: createPlaceholderObj,
            userId
        });
    };

    return { handleSave, isSaving };
}
