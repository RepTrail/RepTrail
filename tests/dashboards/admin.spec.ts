import { test, expect } from '@playwright/test';

test.describe('Admin Panel Access', () => {
    test('should access administrative area', async ({ page }) => {
        await page.goto('/admin');

        // Wait for admin header or specific content
        await expect(page.getByText(/admin/i).first()).toBeVisible();
        await expect(page.getByText(/usuários/i).or(page.getByText(/pagamentos/i))).toBeVisible();
    });
});
