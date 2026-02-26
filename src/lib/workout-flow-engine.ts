
export type WorkoutPhase = 'WARMUP' | 'FEEDER' | 'WORKING';

export interface ExecutionStep {
    exerciseIndex: number;
    phase: WorkoutPhase;
    setNumber: number;
    restSeconds: number;
    groupId: string;
    isLastInBlock: boolean;
    exerciseName: string;
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
        if (isBiSetMember(ex)) {
            currentBlock.push(ex);
        } else {
            if (currentBlock.length > 0) {
                blocks.push(currentBlock);
                currentBlock = [];
            }
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
                // Filtrar exercícios que ainda têm séries nesta fase
                const exercisesInRound = block.filter(ex => getPhaseSets(ex) >= setNum);

                for (let i = 0; i < exercisesInRound.length; i++) {
                    const ex = exercisesInRound[i];
                    const isLastInRound = i === exercisesInRound.length - 1;

                    blockSteps.push({
                        exerciseIndex: ex.originalIndex,
                        exerciseName: ex.exercise?.name || ex.name || 'Exercício',
                        phase,
                        setNumber: setNum,
                        // Descanso apenas após completar o par/trio no round
                        restSeconds: isLastInRound ? (
                            phase === 'WARMUP' ? ex.warmup_rest_seconds || 45 :
                                phase === 'FEEDER' ? ex.feeder_rest_seconds || 60 :
                                    ex.rest_seconds || 60
                        ) : 0,
                        groupId,
                        isLastInBlock: false // Será setado abaixo
                    });
                }
            }
        }

        // Marcar o último passo do bloco para mostrar o resumo
        if (blockSteps.length > 0) {
            blockSteps[blockSteps.length - 1].isLastInBlock = true;
            // O último passo de um bloco não deve ter descanso de transição, 
            // pois o resumo será exibido.
            blockSteps[blockSteps.length - 1].restSeconds = 0;
            steps.push(...blockSteps);
        }
    }

    return steps;
}
