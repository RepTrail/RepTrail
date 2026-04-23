// Central registry for server actions to be called by the Sync Engine
// We map string keys to actual server action functions

import { 
  createStudentWorkout, 
  createStudentDiet, 
  createStudentCardio, 
  createStudentErgogenic,
  deleteStudentDiet,
  deleteStudentCardio,
  assignErgogenic,
  assignCardioToStudent,
  createManualCardio
} from '@/actions/student-content-actions';

import { 
  createManualWorkout, 
  deleteWorkout, 
  updateWorkoutMeta,
  assignWorkout,
  unassignWorkout,
  duplicateWorkout
} from '@/actions/workout-actions';

import { 
  createManualDiet, 
  unassignDiet, 
  assignDiet, 
  duplicateDiet,
  addMealToDiet,
  addMealItem,
  updateMealItem,
  deleteDiet,
  updateDietMeta
} from '@/actions/diet-actions';

import { createStudent, toggleStudentStatus, updateTrainerProfile } from '@/actions/trainer-actions';
import { toggleMealItem, toggleMealGroup, toggleSubstitution, substituteMealItem } from '@/actions/tracking-actions';

import {
  toggleErgogenicLog,
  addErgogenic,
  updateErgogenic
} from '@/actions/ergogenics-actions';

import { 
  createAsaasSubscription, 
  cancelAsaasSubscription 
} from '@/actions/asaas-actions';

import {
  startWorkoutLog,
  recordSetLoad,
  finishWorkoutLog,
  updateLoadEntry,
  deleteWorkoutLog
} from '@/actions/log-actions';

import {
  startCardioSession,
  updateCardioSession,
  finishCardioSession,
  duplicateCardio
} from '@/actions/cardio-actions';

import {
  updateStudentWorkoutDay
} from '@/actions/student-workout-schedule-actions';

import {
  updateStudentData,
  updateStudentProfile,
  deleteProgressPhoto,
  updateProgressPhotoDate,
  markPaymentAsReceived,
  submitTrainerReview
} from '@/actions/student-actions';

import {
  updateMealsOrder,
  updateMealItemsOrder,
  removeMeal,
  removeMealItem,
} from '@/actions/diet-actions';

import {
  updateWorkoutExercisesOrder,
  removeExerciseFromWorkout,
  updateWorkoutExercise
} from '@/actions/workout-actions';

import { saveParsedData } from '@/actions/save-actions';
import { 
  updateAffiliateCommission, 
  toggleAffiliateStatus, 
  updatePayoutStatus,
  reassignReferral
} from '@/actions/admin-affiliate-actions';
import { 
  addOperationalCost, 
  deleteOperationalCost 
} from '@/actions/admin-actions';
import { enableAffiliate, requestPayout } from '@/actions/affiliate-actions';
import { dismissAutoTrainingForSession } from '@/actions/auto-training-actions';
import { deleteErgogenic } from '@/actions/ergogenics-actions';
import { generateAIProtocol } from '@/actions/ai-protocol-actions';


// Define the type for an action function
export type ActionFn = (payload: any) => Promise<{ success: boolean; error?: string; [key: string]: any }>;

/**
 * Standardizes the return of any server action to satisfy the ActionFn type.
 * Ensures success is always return as a boolean.
 */
async function wrap(promise: Promise<any>): Promise<{ success: boolean; error?: string; [key: string]: any }> {
    try {
        const res = await promise;
        return {
            ...res,
            success: res?.success ?? (res?.error ? false : true)
        };
    } catch (e: any) {
        return { success: false, error: e.message || 'Action failed' };
    }
}

// ─── Adapter: Outbox stores plain JSON objects, but some Server Actions expect FormData ──────────
function withFormData(fn: (fd: FormData) => Promise<any>) {
  return async (payload: Record<string, any>) => {
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
  };
}

export const ACTION_REGISTRY: Record<string, ActionFn> = {
  // ─── Student Content ───────────────────────────────────────────────────────────
  'create-student-workout': withFormData(createStudentWorkout as any),
  'create-student-diet': withFormData(createStudentDiet as any),
  'create-student-cardio': withFormData(createStudentCardio as any),
  'create-student-ergogenic': withFormData(createStudentErgogenic as any),
  'delete-student-diet': (p: any) => wrap(deleteStudentDiet(p.id)),
  'delete-student-cardio': (p: any) => wrap(deleteStudentCardio(p.id, p.studentId)),
  'delete-student-ergogenic': (p: any) => wrap(deleteErgogenic(p.id, p.studentId || '')),

  // ─── Workouts ─────────────────────────────────────────────────────────────────
  'create-manual-workout': (p: any) => wrap(createManualWorkout(p)),
  'create-manual-diet': (p: any) => wrap(createManualDiet(p)),
  'create-manual-cardio': withFormData(createManualCardio as any),
  'delete-workout': (p: any) => wrap(deleteWorkout(p.id)),
  'update-workout-meta': (p: any) => wrap(updateWorkoutMeta(p.id, p.name)),
  'assign-workout': (p: any) => wrap(assignWorkout(p.workout_id || p.workoutId, p.student_id || p.studentId, p.day_of_week ?? (Array.isArray(p.daysOfWeek) ? p.daysOfWeek[0] : p.daysOfWeek))),
  'unassign-workout': (p: any) => wrap(unassignWorkout(p.contentId || p.workout_id || p.workoutId, p.student_id || p.studentId)),

  // ─── Trainer ──────────────────────────────────────────────────────────────────
  'create-student': (p: any) => wrap(createStudent(null, p)),
  'toggle-student-status': (p: any) => wrap(toggleStudentStatus(p.relationshipId || p.studentId || p.id, p.active)),
  'update-trainer-profile': (p: any) => wrap(updateTrainerProfile(p.data)),
  'cancel-asaas-subscription': (p: any) => wrap(cancelAsaasSubscription()),
  'update-student-data': (p: any) => wrap(updateStudentData(p.relationshipId, p.studentId, p.trainerId, p.data || p)),
  'update-student-profile': (p: any) => wrap(updateStudentProfile(p.obj || p.data || p)),
  'update-load-entry': (p: any) => wrap(updateLoadEntry(p.loadId, p.weightKg, p.repsPerformed)),

  // ─── Logs & Photos ────────────────────────────────────────────────────────────
  'delete-workout-log': (p: any) => wrap(deleteWorkoutLog(p.id)),
  'delete-progress-photo': (p: any) => wrap(deleteProgressPhoto(p.photoId)),
  'update-progress-photo-date': (p: any) => wrap(updateProgressPhotoDate(p.photoId, p.newDate)),
  'save-progress-photos': async (p: any) => {
    // Adapter: convert flat payload back to FormData if the action expects it
    // Or call the metadata action directly if we already have URLs
    const { uploadProgressPhotos } = await import('@/actions/student-actions');
    const fd = new FormData();
    if (p.front) fd.append('front', p.front);
    if (p.back) fd.append('back', p.back);
    if (p.side_left) fd.append('side_left', p.side_left);
    if (p.side_right) fd.append('side_right', p.side_right);
    fd.append('allow_public', String(p.allowPublic ?? true));
    return wrap(uploadProgressPhotos(fd));
  },
  'create-asaas-subscription': async (p: any) => {
    return wrap(createAsaasSubscription(
      p.tier,
      p.paymentMethod,
      p.cpfCnpj,
      p.fullName,
      p.creditCard
    ));
  },
  
  // ─── Duplication ──────────────────────────────────────────────────────────────
  'duplicate-workout': (p: any) => wrap(duplicateWorkout(p.id)),
  'duplicate-diet': (p: any) => wrap(duplicateDiet(p.id)),
  'duplicate-cardio': (p: any) => wrap(duplicateCardio(p.id)),
  
  // ─── Tracking ─────────────────────────────────────────────────────────────────
  'toggle-meal-item': (p: any) => wrap(toggleMealItem(p.itemId, p.status)),
  'toggle-meal-group': (p: any) => wrap(toggleMealGroup(p.mealId, p.status)),
  'toggle-substitution': (p: any) => wrap(toggleSubstitution(p.itemId, p.date)),
  'substitute-item': (p: any) => wrap(substituteMealItem(p.itemId, p.substituteData, p.date)),
  'generate-ai-protocol': (p: any) => wrap(generateAIProtocol(p.preferences)),
  
  'update-meals-order': (p: any) => wrap(updateMealsOrder(p.dietId, p.orderedIds)),
  'update-meal-items-order': (p: any) => wrap(updateMealItemsOrder(p.mealId, p.orderedIds)),
  'remove-meal': (p: any) => wrap(removeMeal(p.id, p.dietId)),
  'remove-meal-item': (p: any) => wrap(removeMealItem(p.id, p.dietId)),

  'update-workout-exercises-order': (p: any) => wrap(updateWorkoutExercisesOrder(p.workoutId, p.orderedIds)),
  'remove-exercise-from-workout': (p: any) => wrap(removeExerciseFromWorkout(p.id, p.workoutId)),
  'update-workout-exercise': (p: any) => wrap(updateWorkoutExercise(p.id, p.workoutId, p.data)),
  
  'add-exercise-to-workout': async (p: any) => {
    const { addExerciseToWorkout } = await import('@/actions/workout-actions')
    return wrap(addExerciseToWorkout(p.workoutId, p.exerciseId))
  },
  'create-new-exercise': async (p: any) => {
    const { createNewExercise } = await import('@/actions/workout-actions')
    return wrap(createNewExercise(p.name))
  },

  // ─── Diet Builder ─────────────────────────────────────────────────────────────
  'add-meal': (p: any) => wrap(addMealToDiet(p.dietId, p.name, p.timeOfDay || '', p.clientMutationId, p.clientId)),
  'add-meal-item': (p: any) => wrap(addMealItem(p.mealId, p.dietId, p)),
  'update-meal-item': (p: any) => wrap(updateMealItem(p.id, p.dietId, p.data)),
  'delete-diet': (p: any) => wrap(deleteDiet(p.id)),
  'update-diet-meta': (p: any) => wrap(updateDietMeta(p.id, p.data)),

  // ─── Specialized Assignments ──────────────────────────────────────────────────
  'assign-cardio': (p: any) => wrap(assignCardioToStudent(p.cardio_id, p.student_id, p)),
  'assign-cardio-to-student': (p: any) => wrap(assignCardioToStudent(p.cardioId, p.studentId, p)),
  'toggle-ergogenic-log': (p: any) => wrap(toggleErgogenicLog(p.student_id || p.studentId, p.ergogenic_id || p.ergogenicId, p.status)),
  'update-workout-day': (p: any) => wrap(updateStudentWorkoutDay(p.id, p.day_of_week)),
  'update-student-workout-day': (p: any) => wrap(updateStudentWorkoutDay(p.assignmentId, p.dayOfWeek)),
  'unassign-diet': (p: any) => wrap(unassignDiet(p.contentId || p.diet_id || p.dietId, p.student_id || p.studentId)),
  'assign-diet': (p: any) => wrap(assignDiet(p.diet_id || p.dietId, p.student_id || p.studentId, p.daysOfWeek)),
  'assign-ergogenic': (p: any) => wrap(assignErgogenic(p.ergogenic_id || p.ergogenicId, p.student_id || p.studentId, p.daysOfWeek)),
  'mark-payment-received': (p: any) => wrap(markPaymentAsReceived(p.studentId, p.trainerId)),

  // ─── Extras ───────────────────────────────────────────────────────────────────
  'accept-terms': async (p: any) => {
    const { acceptTerms } = await import('@/actions/terms-actions')
    return wrap(acceptTerms(p.allowImageDisclosure))
  },
  'enable-auto-training-trial': async () => {
    const { enableAutoTrainingTrialForCurrentUser } = await import('@/actions/auto-training-actions')
    return wrap(enableAutoTrainingTrialForCurrentUser())
  },
  'dismiss-auto-training': (p: any) => wrap(dismissAutoTrainingForSession(p.userId)),
  'save-parsed-data': (p: any) => wrap(saveParsedData(p.type, p.data, p.studentId)),
  'enable-affiliate': () => wrap(enableAffiliate()),
  'request-payout': (p: any) => wrap(requestPayout(p.amount, p.method, p.details)),
  'update-affiliate-commission': (p: any) => wrap(updateAffiliateCommission(p.affiliateId, p.rate)),
  'toggle-affiliate-status': (p: any) => wrap(toggleAffiliateStatus(p.userId, p.isAffiliate)),
  'update-payout-status': (p: any) => wrap(updatePayoutStatus(p.payoutId, p.status)),
  'reassign-referral': (p: any) => wrap(reassignReferral(p.studentEmail, p.newAffiliateToken)),
  'add-operational-cost': (p: any) => wrap(addOperationalCost(p)),
  'delete-operational-cost': (p: any) => wrap(deleteOperationalCost(p.id)),

  // ─── Tracking & Logs (Player) ─────────────────────────────────────────────────
  'start-workout-log': (p: any) => wrap(startWorkoutLog(p.workoutId || p.id)),
  'record-set-load': (p: any) => wrap(recordSetLoad(p)),
  'finish-workout-log': (p: any) => wrap(finishWorkoutLog(p.id || p.logId, p.feedback, p.perceivedEffort, p.adherenceStatus)),
  'start-cardio-session': (p: any) => wrap(startCardioSession(p.cardioId || p.assignmentId)),
  'update-cardio-session': (p: any) => wrap(updateCardioSession(p.id || p.logId, p.seconds || p.elapsed_seconds || 0, p.running || p.is_running || false)),
  'finish-cardio-session': (p: any) => wrap(finishCardioSession(p.logId, p.feedback, p.intensity, p.percentage)),
  'add-ergogenic': (p: any) => wrap(addErgogenic(p)),
  'update-ergogenic': (p: any) => wrap(updateErgogenic(p.id, p.studentId || p.student_id, p.data || p)),
  'update-student-ergogenic': (p: any) => wrap(updateErgogenic(p.id, p.student_id || p.studentId, p.data || p)),
  'duplicate-student-ergogenic': (p: any) => wrap(addErgogenic(p)),
  'submit-trainer-review': (p: any) => wrap(submitTrainerReview(p)),
};

/**
 * Executes a registered action by name with the given payload.
 * Called by the Sync Engine to replay Outbox mutations after reconnection.
 */
export async function executeAction(name: string, payload: any) {
  const actionFn = ACTION_REGISTRY[name];
  
  if (!actionFn) {
    // 🚨 FATAL Safety check for Local-First: Fail fast if action is missing
    throw new Error(`[Outbox] Action not registered: ${name}. Sync cannot proceed.`);
  }

  try {
    return await actionFn(payload);
  } catch (error: any) {
    console.error(`[Registry] Error executing action "${name}":`, error);
    return { success: false, error: error.message || 'Unknown error' };
  }
}

