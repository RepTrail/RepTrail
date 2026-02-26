import { test, expect } from '@playwright/test';

test.describe('RepTrail Smoke Tests - Landing Page', () => {
    test('should load the landing page successfully', async ({ page }) => {
        await page.goto('/');

        // Check for main title or branding
        await expect(page).toHaveTitle(/RepTrail/i);

        // Check for important sections using specific role labels (best practice)
        const heroTitle = page.getByRole('heading', { name: /domine a consultoria/i, level: 1 });
        await expect(heroTitle).toBeVisible();

        // Ensure no major console errors
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`ERROR NO CONSOLE: "${msg.text()}"`);
            }
        });
    });

    test('should have working navigation links', async ({ page }) => {
        await page.goto('/');

        // Check for login button using reliable role locator
        const loginBtn = page.getByRole('link', { name: /login/i }).first();
        await expect(loginBtn).toBeVisible();
    });
});

test.describe('Shared Components Integrity', () => {
    test('should not have broken images', async ({ page }) => {
        await page.goto('/');
        const images = page.locator('img');
        const count = await images.count();

        for (let i = 0; i < count; i++) {
            const src = await images.nth(i).getAttribute('src');
            if (src && !src.startsWith('data:')) {
                const response = await page.request.get(src);
                expect(response.status(), `Imagem quebrada: ${src}`).toBeLessThan(400);
            }
        }
    });
});
