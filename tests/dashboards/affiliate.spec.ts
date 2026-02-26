import { test, expect } from '@playwright/test';

test.describe('Affiliate Dashboard Access', () => {
    test('should load affiliate dashboard', async ({ page }) => {
        // Since it's the same trainer account, we try to go to the affiliate path
        await page.goto('/dashboard/affiliate');

        // Check for affiliate specific content
        await expect(page.getByText(/comissões/i).or(page.getByText(/pixel/i))).toBeVisible();
    });
});
