import { defineConfig, devices } from '@playwright/test'
import { randomBytes } from 'node:crypto'

process.env.PLAYWRIGHT_AUTH_SECRET ??= randomBytes(32).toString('hex')

const browserProjects = [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
  {
    name: 'mobile-chrome',
    use: { ...devices['Pixel 7'] },
  },
  {
    name: 'mobile-safari',
    use: { ...devices['iPhone 13'] },
  },
]

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  projects: [
    { baseURL: 'http://127.0.0.1:3100', name: 'melding-form' },
    { baseURL: 'http://127.0.0.1:3102', name: 'back-office' },
  ].flatMap((app) =>
    browserProjects.map((browser) => ({
      name: `${app.name}-${browser.name}`,
      testDir: `./${app.name}`,
      use: { ...browser.use, baseURL: app.baseURL },
    })),
  ),
  reporter: 'list',
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'pnpm --filter melding-form dev --hostname 127.0.0.1 --port 3100',
      env: {
        NEXT_INTERNAL_BACKEND_BASE_URL: 'http://localhost:8000',
        NEXT_PUBLIC_BACK_OFFICE_BASE_URL: 'http://127.0.0.1:3102',
        NEXT_PUBLIC_BACKEND_BASE_URL: 'http://localhost:8000',
        NEXT_PUBLIC_MELDING_FORM_BASE_URL: 'http://127.0.0.1:3100',
        PLAYWRIGHT_TEST: '1',
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: 'http://127.0.0.1:3100/cookie-storing',
    },
    {
      command: 'pnpm --filter back-office exec next dev --hostname 127.0.0.1 --port 3102',
      env: {
        NEXT_INTERNAL_BACKEND_BASE_URL: 'http://localhost:8000',
        NEXT_PUBLIC_BACKEND_BASE_URL: 'http://localhost:8000',
        NEXT_PUBLIC_BASE_PATH: '',
        NEXT_PUBLIC_MELDING_FORM_BASE_URL: 'http://127.0.0.1:3100',
        NEXTAUTH_SECRET: process.env.PLAYWRIGHT_AUTH_SECRET,
        NEXTAUTH_URL: 'http://127.0.0.1:3102',
        PLAYWRIGHT_TEST: '1',
      },
      reuseExistingServer: false,
      timeout: 120_000,
      url: 'http://127.0.0.1:3102/robots.txt',
    },
  ],
})
