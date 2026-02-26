import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authDir = path.join(__dirname, '../.auth');

async function performLogin(page: any, email: string, password: string, expectedUrlPattern: RegExp) {
    await page.goto('/auth/login');
    await page.locator('#email').fill(email);
    await page.locator('#password').fill(password);

    // Clica e aguarda o processamento inicial
    await page.getByRole('button', { name: /entrar agora/i }).click();

    // Se houver um alerta de erro visível após o clique, captura e falha
    const errorAlert = page.locator('div[role="alert"]');
    if (await errorAlert.isVisible()) {
        const message = await errorAlert.textContent();
        throw new Error(`Falha no Login para ${email}: ${message}`);
    }

    // Aumenta o timeout para acomodar o redirecionamento do Next.js e Supabase
    await expect(page).toHaveURL(expectedUrlPattern, { timeout: 15000 });
}

setup.describe('Authentication Setup', () => {

    setup('authenticate as student (trainer-led)', async ({ page }) => {
        await performLogin(page, 'socramgamer71@gmail.com', '29052003Kmk-', /\/dashboard\/student/);
        await page.context().storageState({ path: path.join(authDir, 'student.json') });
    });

    setup('authenticate as student (auto-training)', async ({ page }) => {
        await performLogin(page, 'scrm74@gmail.com', '29052003Kmk-', /\/dashboard\/student/);
        await page.context().storageState({ path: path.join(authDir, 'auto-student.json') });
    });

    setup('authenticate as trainer/admin/affiliate', async ({ page }) => {
        await performLogin(page, 'Marcos.contatoprof@gmail.com', '29052003Kmk-', /\/dashboard\/trainer/);
        await page.context().storageState({ path: path.join(authDir, 'trainer.json') });
    });
});
