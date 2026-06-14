// Central registry for server actions to be called by the Sync Engine
// We map string keys to actual server action functions

// 🧠 Dynamic imports used below in ACTION_REGISTRY to avoid Turbopack HMR errors

// Define the type for an action function
export type ActionFn = (payload: any) => Promise<{ success: boolean; error?: string; [key: string]: any }>;

/**
 * Standardizes the return of any server action to satisfy the ActionFn type.
 */
async function wrap(promise: Promise<any>): Promise<{ success: boolean; error?: string; [key: string]: any }> {
    try {
        const res = await promise;
        const error = res?.error || res?.message;
        return {
            ...res,
            success: res?.success ?? (error ? false : true),
            error: error
        };
    } catch (e: any) {
        console.error('[Registry Wrap Error]', e);
        return { success: false, error: e.message || 'Action failed' };
    }
}

// ─── Adapter: Outbox stores plain JSON objects, but some Server Actions expect FormData ──────────
async function executeWithFormData(fn: any, payload: Record<string, any>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    if (value !== undefined && value !== null) {
      if (value instanceof File || value instanceof Blob) {
         fd.append(key, value);
      } else {
         fd.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    }
  }
  return wrap(fn(fd));
}

export const ACTION_REGISTRY: Record<string, ActionFn> = {
  // ─── Student Content ───────────────────────────────────────────────────────────
  'create-student-workout': async (p) => { const { createStudentWorkout } = await import('@/actions/student-content-actions'); return executeWithFormData(createStudentWorkout, p); },
  'create-student-diet': async (p) => { const { createStudentDiet } = await import('@/actions/student-content-actions'); return executeWithFormData(createStudentDiet, p); },
  'create-student-cardio': async (p) => { const { createStudentCardio } = await import('@/actions/student-content-actions'); return executeWithFormData(createStudentCardio, p); },
  'create-student-ergogenic': async (p) => { const { createStudentErgogenic } = await import('@/actions/student-content-actions'); return executeWithFormData(createStudentErgogenic, p); },
  
  'delete-student-diet': async (p) => { const { deleteStudentDiet } = await import('@/actions/student-content-actions'); return wrap(deleteStudentDiet(p.id)); },
  'delete-student-cardio': async (p) => { const { deleteStudentCardio } = await import('@/actions/student-content-actions'); return wrap(deleteStudentCardio(p.id, p.studentId || p.relationshipId)); },
  'delete-student-ergogenic': async (p) => { const { deleteErgogenic } = await import('@/actions/ergogenics-actions'); return wrap(deleteErgogenic(p.id, p.studentId || p.relationshipId || '')); },
  'delete-ergogenic': async (p) => { const { deleteErgogenic } = await import('@/actions/ergogenics-actions'); return wrap(deleteErgogenic(p.id, p.studentId || p.relationshipId || '')); },
  'delete-student-workout': async (p) => { const { deleteStudentWorkout } = await import('@/actions/student-content-actions'); return wrap(deleteStudentWorkout(p.id)); },

  // ─── Workouts ─────────────────────────────────────────────────────────────────
  'create-manual-workout': async (p) => { const { createManualWorkout } = await import('@/actions/workout-actions'); return wrap(createManualWorkout(p)); },
  'create-manual-diet': async (p) => { const { createManualDiet } = await import('@/actions/diet-actions'); return wrap(createManualDiet(p)); },
  'create-manual-cardio': async (p) => { const { createManualCardio } = await import('@/actions/student-content-actions'); return executeWithFormData(createManualCardio, p); },
  'delete-workout': async (p) => { const { deleteWorkout } = await import('@/actions/workout-actions'); return wrap(deleteWorkout(p.id)); },
  'update-workout-meta': async (p) => { const { updateWorkoutMeta } = await import('@/actions/workout-actions'); return wrap(updateWorkoutMeta(p.id, p.name)); },
  'assign-workout': async (p) => { const { assignWorkout } = await import('@/actions/workout-actions'); return wrap(assignWorkout(p.workout_id || p.workoutId, p.student_id || p.studentId, p.day_of_week ?? p.day ?? (Array.isArray(p.daysOfWeek) ? p.daysOfWeek[0] : p.daysOfWeek))); },
  'unassign-workout': async (p) => { const { unassignWorkout } = await import('@/actions/workout-actions'); return wrap(unassignWorkout(p.contentId || p.workout_id || p.workoutId || p.id, p.student_id || p.studentId || p.relationshipId)); },

  // ─── Trainer ──────────────────────────────────────────────────────────────────
  'create-student': async (p) => { const { createStudent } = await import('@/actions/trainer-actions'); return wrap(createStudent(null, p)); },
  'toggle-student-status': async (p) => { const { toggleStudentStatus } = await import('@/actions/trainer-actions'); return wrap(toggleStudentStatus(p.relationshipId || p.studentId || p.id, p.active)); },
  'update-trainer-profile': async (p) => { const { updateTrainerProfile } = await import('@/actions/trainer-actions'); return wrap(updateTrainerProfile(p.data)); },
  'cancel-asaas-subscription': async (p) => { const { cancelAsaasSubscription } = await import('@/actions/asaas-actions'); return wrap(cancelAsaasSubscription()); },
  'update-student-data': async (p) => { const { updateStudentData } = await import('@/actions/student-actions'); return wrap(updateStudentData(p.relationshipId, p.studentId, p.trainerId, p.data || p)); },
  'update-student-profile': async (p) => { const { updateStudentProfile } = await import('@/actions/student-actions'); return wrap(updateStudentProfile(p.obj || p.data || p)); },
  'update-load-entry': async (p) => { const { updateLoadEntry } = await import('@/actions/log-actions'); return wrap(updateLoadEntry(p.loadId, p.weightKg, p.repsPerformed)); },

  // ─── Logs & Photos ────────────────────────────────────────────────────────────
  'delete-workout-log': async (p) => { const { deleteWorkoutLog } = await import('@/actions/log-actions'); return wrap(deleteWorkoutLog(p.id)); },
  'delete-progress-photo': async (p) => { const { deleteProgressPhoto } = await import('@/actions/student-actions'); return wrap(deleteProgressPhoto(p.photoId)); },
  'update-progress-photo-date': async (p) => { const { updateProgressPhotoDate } = await import('@/actions/student-actions'); return wrap(updateProgressPhotoDate(p.photoId, p.newDate)); },
  'save-progress-photos': async (p) => {
    const { uploadProgressPhotos } = await import('@/actions/student-actions');
    const fd = new FormData();
    if (p.front) fd.append('front', p.front);
    if (p.back) fd.append('back', p.back);
    if (p.side_left) fd.append('side_left', p.side_left);
    if (p.side_right) fd.append('side_right', p.side_right);
    fd.append('allow_public', String(p.allowPublic ?? true));
    return wrap(uploadProgressPhotos(fd));
  },
  'create-asaas-subscription': async (p) => {
    const { createAsaasSubscription } = await import('@/actions/asaas-actions');
    return wrap(createAsaasSubscription(p.tier, p.paymentMethod, p.cpfCnpj, p.fullName, p.creditCard));
  },
  
  // ─── Duplication ──────────────────────────────────────────────────────────────
  'duplicate-workout': async (p) => { const { duplicateWorkout } = await import('@/actions/workout-actions'); return wrap(duplicateWorkout(p.id)); },
  'duplicate-diet': async (p) => { const { duplicateDiet } = await import('@/actions/diet-actions'); return wrap(duplicateDiet(p.id)); },
  'duplicate-cardio': async (p) => { const { duplicateCardio } = await import('@/actions/cardio-actions'); return wrap(duplicateCardio(p.id)); },
  
  // ─── Tracking ─────────────────────────────────────────────────────────────────
  'toggle-meal-item': async (p) => { const { toggleMealItem } = await import('@/actions/tracking-actions'); return wrap(toggleMealItem(p.itemId, !p.currentStatus)); },
  'toggle-meal-group': async (p) => { const { toggleMealGroup } = await import('@/actions/tracking-actions'); return wrap(toggleMealGroup(p.mealId, !p.currentStatus)); },
  'toggle-substitution': async (p) => { const { toggleSubstitution } = await import('@/actions/tracking-actions'); return wrap(toggleSubstitution(p.itemId, p.date)); },
  'substitute-item': async (p) => { const { substituteMealItem } = await import('@/actions/tracking-actions'); return wrap(substituteMealItem(p.itemId, p.substituteData, p.date)); },
  'generate-ai-protocol': async (p) => {
    const { generateAIProtocol } = await import('@/actions/ai-protocol-actions');
    return wrap(generateAIProtocol(p.preferences));
  },
  
  'update-meals-order': async (p) => { const { updateMealsOrder } = await import('@/actions/diet-actions'); return wrap(updateMealsOrder(p.dietId, p.orderedIds)); },
  'update-meal-items-order': async (p) => { const { updateMealItemsOrder } = await import('@/actions/diet-actions'); return wrap(updateMealItemsOrder(p.mealId, p.orderedIds)); },
  'remove-meal': async (p) => { const { removeMeal } = await import('@/actions/diet-actions'); return wrap(removeMeal(p.id, p.dietId)); },
  'remove-meal-item': async (p) => { const { removeMealItem } = await import('@/actions/diet-actions'); return wrap(removeMealItem(p.id, p.dietId)); },

  'update-workout-exercises-order': async (p) => { const { updateWorkoutExercisesOrder } = await import('@/actions/workout-actions'); return wrap(updateWorkoutExercisesOrder(p.workoutId, p.orderedIds)); },
  'remove-exercise-from-workout': async (p) => { const { removeExerciseFromWorkout } = await import('@/actions/workout-actions'); return wrap(removeExerciseFromWorkout(p.id, p.workoutId)); },
  'update-workout-exercise': async (p) => { const { updateWorkoutExercise } = await import('@/actions/workout-actions'); return wrap(updateWorkoutExercise(p.id, p.workoutId, p.data)); },
  
  'add-exercise-to-workout': async (p) => { const { addExerciseToWorkout } = await import('@/actions/workout-actions'); return wrap(addExerciseToWorkout(p.workoutId, p.exerciseId)); },
  'create-new-exercise': async (p) => { const { createNewExercise } = await import('@/actions/workout-actions'); return wrap(createNewExercise(p.name)); },

  // ─── Diet Builder ─────────────────────────────────────────────────────────────
  'add-meal': async (p) => { const { addMealToDiet } = await import('@/actions/diet-actions'); return wrap(addMealToDiet(p.dietId, p.name, p.timeOfDay || '', p.clientMutationId, p.clientId)); },
  'add-meal-item': async (p) => { const { addMealItem } = await import('@/actions/diet-actions'); return wrap(addMealItem(p.mealId, p.dietId, p)); },
  'update-meal-item': async (p) => { const { updateMealItem } = await import('@/actions/diet-actions'); return wrap(updateMealItem(p.id, p.dietId, p.data)); },
  'delete-diet': async (p) => { const { deleteDiet } = await import('@/actions/diet-actions'); return wrap(deleteDiet(p.id)); },
  'delete-cardio': async (p) => { const { deleteCardio } = await import('@/actions/cardio-actions'); return wrap(deleteCardio(p.id)); },
  'create-cardio': async (p) => { const { createCardio } = await import('@/actions/cardio-actions'); return wrap(createCardio(p.name, p?.description, p.duration, p.intensity, p.daysOfWeek || p.selectedDays)); },
  'update-cardio': async (p) => { const { updateCardioMeta } = await import('@/actions/cardio-actions'); return wrap(updateCardioMeta(p.id, p.name, p?.description, p.duration, p.intensity)); },
  'update-diet-meta': async (p) => { const { updateDietMeta } = await import('@/actions/diet-actions'); return wrap(updateDietMeta(p.id, p.data)); },

  // ─── Specialized Assignments ──────────────────────────────────────────────────
  'assign-cardio': async (p) => { 
    const { assignCardioToStudent } = await import('@/actions/student-content-actions'); 
    return wrap(assignCardioToStudent(p.cardioId || p.cardio_id, p.studentId || p.student_id, p)); 
  },
  'assign-cardio-to-student': async (p) => { const { assignCardioToStudent } = await import('@/actions/student-content-actions'); return wrap(assignCardioToStudent(p.cardioId, p.studentId, p)); },
  'toggle-ergogenic-log': async (p) => { const { toggleErgogenicLog } = await import('@/actions/ergogenics-actions'); return wrap(toggleErgogenicLog(p.student_id || p.studentId, p.ergogenic_id || p.ergogenicId, p.status)); },
  'update-workout-day': async (p) => { const { updateStudentWorkoutDay } = await import('@/actions/student-workout-schedule-actions'); return wrap(updateStudentWorkoutDay(p.id, p.day_of_week)); },
  'update-student-workout-day': async (p) => { const { updateStudentWorkoutDay } = await import('@/actions/student-workout-schedule-actions'); return wrap(updateStudentWorkoutDay(p.assignmentId, p.dayOfWeek)); },
  'unassign-diet': async (p) => { const { unassignDiet } = await import('@/actions/diet-actions'); return wrap(unassignDiet(p.contentId || p.diet_id || p.dietId || p.id, p.student_id || p.studentId || p.relationshipId)); },
  'assign-diet': async (p) => { const { assignDiet } = await import('@/actions/diet-actions'); return wrap(assignDiet(p.diet_id || p.dietId, p.student_id || p.studentId, p.daysOfWeek)); },
  'assign-ergogenic': async (p) => { const { assignErgogenic } = await import('@/actions/student-content-actions'); return wrap(assignErgogenic(p.ergogenic_id || p.ergogenicId, p.student_id || p.studentId, p.daysOfWeek)); },
  'mark-payment-received': async (p) => { const { markPaymentAsReceived } = await import('@/actions/student-actions'); return wrap(markPaymentAsReceived(p.studentId, p.trainerId)); },

  // ─── Extras ───────────────────────────────────────────────────────────
  'accept-terms': async (p) => { const { acceptTerms } = await import('@/actions/terms-actions'); return wrap(acceptTerms(p.allowImageDisclosure)); },
  'enable-auto-training-trial': async () => { const { enableAutoTrainingTrialForCurrentUser } = await import('@/actions/auto-training-actions'); return wrap(enableAutoTrainingTrialForCurrentUser()); },
  'dismiss-auto-training': async (p) => { const { dismissAutoTrainingForSession } = await import('@/actions/auto-training-actions'); return wrap(dismissAutoTrainingForSession(p.userId)); },
  'save-parsed-data': async (p) => { const { saveParsedData } = await import('@/actions/save-actions'); return wrap(saveParsedData(p.type, p.data, p.studentId, p.createPlaceholder)); },
  'enable-affiliate': async () => { const { enableAffiliate } = await import('@/actions/affiliate-actions'); return wrap(enableAffiliate()); },
  'request-payout': async (p) => { const { requestPayout } = await import('@/actions/affiliate-actions'); return wrap(requestPayout(p.amount, p.method, p.details)); },
  'update-affiliate-commission': async (p) => { const { updateAffiliateCommission } = await import('@/actions/admin-affiliate-actions'); return wrap(updateAffiliateCommission(p.affiliateId, p.rate)); },
  'toggle-affiliate-status': async (p) => { const { toggleAffiliateStatus } = await import('@/actions/admin-affiliate-actions'); return wrap(toggleAffiliateStatus(p.userId, p.isAffiliate)); },
  'update-payout-status': async (p) => { const { updatePayoutStatus } = await import('@/actions/admin-affiliate-actions'); return wrap(updatePayoutStatus(p.payoutId, p.status)); },
  'reassign-referral': async (p) => { const { reassignReferral } = await import('@/actions/admin-affiliate-actions'); return wrap(reassignReferral(p.studentEmail, p.newAffiliateToken)); },
  'add-operational-cost': async (p) => { const { addOperationalCost } = await import('@/actions/admin-actions'); return wrap(addOperationalCost(p)); },
  'update-operational-cost': async (p) => { const { updateOperationalCost } = await import('@/actions/admin-actions'); return wrap(updateOperationalCost(p.id, p)); },
  'delete-operational-cost': async (p) => { const { deleteOperationalCost } = await import('@/actions/admin-actions'); return wrap(deleteOperationalCost(p.id)); },

  // ─── Tracking & Logs (Player) ─────────────────────────────────────────────────
  'start-workout-log': async (p) => { const { startWorkoutLog } = await import('@/actions/log-actions'); return wrap(startWorkoutLog(p.workoutId, p.id)); },
  'record-set-load': async (p) => { const { recordSetLoad } = await import('@/actions/log-actions'); return wrap(recordSetLoad(p)); },
  'finish-workout-log': async (p) => { const { finishWorkoutLog } = await import('@/actions/log-actions'); return wrap(finishWorkoutLog(p.id || p.logId, p.feedback, p.perceivedEffort, p.adherenceStatus)); },
  'finish-workout': async (p) => { const { finishWorkoutLog } = await import('@/actions/log-actions'); return wrap(finishWorkoutLog(p.id || p.logId, p.feedback, p.perceivedEffort, p.adherenceStatus)); },
  'start-cardio-session': async (p) => { const { startCardioSession } = await import('@/actions/cardio-actions'); return wrap(startCardioSession(p.cardioId || p.assignmentId)); },
  'update-cardio-session': async (p) => { const { updateCardioSession } = await import('@/actions/cardio-actions'); return wrap(updateCardioSession(p.id || p.logId, p.seconds || p.elapsed_seconds || 0, p.running || p.is_running || false)); },
  'finish-cardio-session': async (p) => { const { finishCardioSession } = await import('@/actions/cardio-actions'); return wrap(finishCardioSession(p.logId, p.feedback, p.intensity, p.percentage)); },
  'update-workout-log-state': async (p) => { const { saveWorkoutLogState } = await import('@/actions/log-actions'); return wrap(saveWorkoutLogState(p.logId, p.state)); },
  'save-workout-state': async (p) => { const { saveWorkoutLogState } = await import('@/actions/log-actions'); return wrap(saveWorkoutLogState(p.logId, p.state)); },
  'add-ergogenic': async (p) => { const { addErgogenic } = await import('@/actions/ergogenics-actions'); return wrap(addErgogenic(p)); },
  'update-ergogenic': async (p) => { const { updateErgogenic } = await import('@/actions/ergogenics-actions'); return wrap(updateErgogenic(p.id, p.studentId || p.student_id, p.data || p)); },
  'update-student-ergogenic': async (p) => { const { updateErgogenic } = await import('@/actions/ergogenics-actions'); return wrap(updateErgogenic(p.id, p.student_id || p.studentId, p.data || p)); },
  'duplicate-student-ergogenic': async (p) => { const { addErgogenic } = await import('@/actions/ergogenics-actions'); return wrap(addErgogenic(p)); },
  'submit-trainer-review': async (p) => { const { submitTrainerReview } = await import('@/actions/student-actions'); return wrap(submitTrainerReview(p)); },
};

/**
 * Executes a registered action by name with the given payload.
 */
export async function executeAction(name: string, payload: any) {
  const actionFn = ACTION_REGISTRY[name];
  
  if (!actionFn) {
    throw new Error(`[Outbox] Action not registered: ${name}. Sync cannot proceed.`);
  }

  try {
    // We return the result of the async function directly, which is a Promise
    return await actionFn(payload);
  } catch (error: any) {
    console.error(`[Registry] Error executing action "${name}":`, error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}
