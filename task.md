# Plan Limits Implementation Tasks

- `[x]` Create `src/lib/dal/plan-limits.ts` with `usePlanLimits` hook and auxiliary functions.
- `[x]` Export `usePlanLimits` from `src/lib/dal/index.ts`.
- `[x]` Update `TrainerStudentPhotosActivitiesSection` to enforce the 2 photos/month limit using `usePlanLimits`.
- `[x]` Update `MeuPersonalSectionContent` to display the automatic seal based on the plan.
- `[x]` Ensure "Loja" (Store) is accessible regardless of the plan.
- `[x]` Update `eslint.config.mjs` fixes (Completed previously).
- `[/]` Fix page.tsx inline violations (17 pages).
- `[ ]` Fix trainer layout Server Actions violation.
