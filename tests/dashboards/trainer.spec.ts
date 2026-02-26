import { test, expect } from '@playwright/test';

test.describe('Trainer Dashboard - Deep Scan', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/trainer');
    });

    test('should load student list and main metrics', async ({ page }) => {
        // Check if dashboard header is visible
        await expect(page.getByText(/aluno/i).first()).toBeVisible();

        // Wait for potential data fetching (like student count cards)
        const statsCards = page.locator('.bg-zinc-900').filter({ hasText: /alunos/i });
        if (await statsCards.count() > 0) {
            await expect(statsCards.first()).toBeVisible();
        }
    });

    test('should open Unified Assign Dialog (Workout)', async ({ page }) => {
        // Go to workouts section
        await page.goto('/dashboard/trainer/workouts');

        // Try to click an "Atribuir" button if it exists
        const assignBtn = page.getByRole('button', { name: /atribuir/i }).first();
        if (await assignBtn.count() > 0) {
            await assignBtn.click();
            // Verify if UnifiedAssignDialog opened
            await expect(page.getByRole('dialog')).toBeVisible();
            await expect(page.getByText(/selecione os alunos/i)).toBeVisible();
        }
    });

    test('should check for console errors on trainer page', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        await page.reload();
        // Wait for page to stabilize
        await page.waitForTimeout(2000);

        expect(errors, `Erros encontrados no console: ${errors.join(', ')}`).toHaveLength(0);
    });
});
