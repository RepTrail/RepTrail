import { test, expect } from '@playwright/test';

test.describe('Student Dashboard - Deep Scan', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/dashboard/student');
    });

    test('should load main dashboard elements', async ({ page }) => {
        // Check for greeting or standard student elements
        await expect(page.getByText(/treinos/i).first()).toBeVisible();
        await expect(page.getByText(/dieta/i).first()).toBeVisible();
    });

    test('should verify ergogenics module (unified)', async ({ page }) => {
        // Navigate to ergogenics page
        await page.goto('/dashboard/student/ergogenics');

        // Wait for the UnifiedErgogenicsModule to load
        await expect(page.getByText(/meus ergogênicos/i)).toBeVisible();

        // Check for specific elements of the unified module
        const historyBtn = page.getByRole('button', { name: /histórico/i });
        if (await historyBtn.count() > 0) {
            await expect(historyBtn).toBeVisible();
        }
    });

    test('should ensure no console errors on student dashboard', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') errors.push(msg.text());
        });

        await page.reload();
        await page.waitForTimeout(2000);

        expect(errors, `Erros encontrados no console: ${errors.join(', ')}`).toHaveLength(0);
    });
});
