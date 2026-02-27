
export type WorkoutPhase = 'WARMUP' | 'FEEDER' | 'WORKING';

export interface ExecutionStep {
    exerciseIndex: number;
    phase: WorkoutPhase;
    setNumber: number;
    restSeconds: number;
    groupId: string;
    isLastInBlock: boolean;
    exerciseName: string;
    subIndex?: number;
}

export function isBiSetMember(ex: any) {
    if (!ex) return false;
    const n = ex.notes?.toUpperCase() || '';
    const title = ex.exercise?.name?.toUpperCase() || ex.name?.toUpperCase() || '';
    const lowRest = ex.rest_seconds <= 15;
    const hasKeyword = n.includes('BI-SET') || n.includes('CONJUGADO') || n.includes('SUPER-SET') ||
        title.includes('BI-SET') || title.includes('CONJUGADO') || title.includes('+');
    return lowRest || hasKeyword;
}

export function generateExecutionSteps(exercises: any[]): ExecutionStep[] {
    const steps: ExecutionStep[] = [];
    const totalExercises = exercises.length;

    // 1. Agrupar exercícios em blocos
    const blocks: any[][] = [];
    let currentBlock: any[] = [];

    for (let i = 0; i < totalExercises; i++) {
        const ex = { ...exercises[i], originalIndex: i };

        // Se já temos um bloco iniciado por um bi-set (rest <= 15 no anterior)
        // ou se o atual é explicitamente marcado como bi-set membro
        if (currentBlock.length > 0) {
            const prevEx = currentBlock[currentBlock.length - 1];
            if ((prevEx.rest_seconds !== undefined && prevEx.rest_seconds <= 15) || isBiSetMember(ex)) {
                currentBlock.push(ex);
                continue;
            } else {
                blocks.push(currentBlock);
                currentBlock = [];
            }
        }

        if (isBiSetMember(ex)) {
            currentBlock.push(ex);
        } else {
            blocks.push([ex]);
        }
    }
    if (currentBlock.length > 0) blocks.push(currentBlock);

    // 2. Expandir blocos em passos lineares
    for (const block of blocks) {
        const groupId = `group-${block[0].originalIndex}`;
        const phases: WorkoutPhase[] = ['WARMUP', 'FEEDER', 'WORKING'];

        const blockSteps: ExecutionStep[] = [];

        for (const phase of phases) {
            const getPhaseSets = (ex: any) => {
                if (phase === 'WARMUP') return ex.warmup_sets || 0;
                if (phase === 'FEEDER') return ex.feeder_sets || 0;
                return ex.working_sets || 3;
            };

            const maxSetsInPhase = Math.max(...block.map(getPhaseSets));

            for (let setNum = 1; setNum <= maxSetsInPhase; setNum++) {
                // Em um bi-set, todos os exercícios do bloco participam da rodada.
                // Se o exercício A tem aquecimento e o B não tem, forçamos o B a ter para não quebrar a sincronia do conjugado (Ex A -> Ex B -> Descanso).
                const exercisesInRound = block.length > 1 ? block : block.filter(ex => getPhaseSets(ex) >= setNum);

                const flattenedExercisesInRound: any[] = [];
                let currentSubIndex = 0;
                for (const ex of exercisesInRound) {
                    const fullName = ex.exercise?.name || ex.name || '';
                    if (fullName.includes('+')) {
                        const parts = fullName.split('+').map((p: string) => p.trim());
                        parts.forEach((part: string) => {
                            flattenedExercisesInRound.push({ ...ex, exerciseName: part, subIndex: currentSubIndex++ });
                        });
                    } else {
                        flattenedExercisesInRound.push({ ...ex, exerciseName: fullName, subIndex: currentSubIndex++ });
                    }
                }

                for (let i = 0; i < flattenedExercisesInRound.length; i++) {
                    const ex = flattenedExercisesInRound[i];
                    const isLastInRound = i === flattenedExercisesInRound.length - 1;

                    blockSteps.push({
                        exerciseIndex: ex.originalIndex,
                        exerciseName: ex.exerciseName,
                        phase,
                        setNumber: setNum,
                        // Descanso apenas após completar o par/trio no round
                        restSeconds: isLastInRound ? (
                            phase === 'WARMUP' ? ex.warmup_rest_seconds || 45 :
                                phase === 'FEEDER' ? ex.feeder_rest_seconds || 60 :
                                    ex.rest_seconds || 60
                        ) : 0,
                        groupId,
                        isLastInBlock: false,
                        subIndex: flattenedExercisesInRound.length > 1 ? ex.subIndex : undefined
                    });
                }
            }
        }

        // Marcar o último passo do bloco para mostrar o resumo
        if (blockSteps.length > 0) {
            blockSteps[blockSteps.length - 1].isLastInBlock = true;
            // Mantemos o descanso mesmo no último passo para o player decidir quando mostrar o resumo
            steps.push(...blockSteps);
        }
    }

    return steps;
}

