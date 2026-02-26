import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
    },
    projects: [
        // Setup project
        { name: 'setup', testMatch: /auth\.setup\.ts/ },

        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
            dependencies: ['setup'],
        },

        // Specific roles
        {
            name: 'trainer-dashboard',
            testDir: './tests/dashboards',
            testMatch: /trainer\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: '.auth/trainer.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'student-dashboard',
            testDir: './tests/dashboards',
            testMatch: /student\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: '.auth/student.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'affiliate-dashboard',
            testDir: './tests/dashboards',
            testMatch: /affiliate\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: '.auth/trainer.json', // Same actual account
            },
            dependencies: ['setup'],
        },
        {
            name: 'admin-dashboard',
            testDir: './tests/dashboards',
            testMatch: /admin\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: '.auth/trainer.json', // Same actual account
            },
            dependencies: ['setup'],
        },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe',
    },
});
