import { defineConfig, devices } from '@playwright/test'

const meldingFormBaseURL = process.env.PLAYWRIGHT_MELDING_FORM_BASE_URL
const backOfficeBaseURL = process.env.PLAYWRIGHT_BACK_OFFICE_BASE_URL

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
    ...[
      { baseURL: `${(meldingFormBaseURL || 'http://127.0.0.1:3100').replace(/\/$/, '')}/`, name: 'melding-form' },
      { baseURL: `${(backOfficeBaseURL || 'http://localhost:3102').replace(/\/$/, '')}/`, name: 'back-office' },
    ].flatMap((app) =>
      browserProjects.map((browser) => ({
        name: `${app.name}-${browser.name}`,
        testDir: `./${app.name}`,
        use: {
          ...browser.use,
          baseURL: app.baseURL,
        },
      })),
    ),
  ],
  reporter: 'list',
  retries: process.env.CI ? 2 : 0,
  use: {
    trace: 'retain-on-failure',
  },
  webServer: [
    ...(meldingFormBaseURL
      ? []
      : [
          {
            command: 'pnpm --filter melding-form dev --hostname 127.0.0.1 --port 3100',
            env: {
              NEXT_INTERNAL_BACKEND_BASE_URL: 'http://localhost:8000',
              NEXT_PUBLIC_BACK_OFFICE_BASE_URL: 'http://localhost:3102',
              NEXT_PUBLIC_BACKEND_BASE_URL: 'http://localhost:8000',
              NEXT_PUBLIC_MELDING_FORM_BASE_URL: 'http://127.0.0.1:3100',
              PLAYWRIGHT_TEST: '1',
            },
            reuseExistingServer: !process.env.CI,
            timeout: 120_000,
            url: 'http://127.0.0.1:3100/cookie-storing',
          },
        ]),
    ...(backOfficeBaseURL
      ? []
      : [
          {
            command: 'pnpm --filter back-office exec next dev --hostname localhost --port 3102',
            env: {
              NEXT_INTERNAL_BACKEND_BASE_URL: 'http://localhost:8000',
              NEXT_PUBLIC_BACKEND_BASE_URL: 'http://localhost:8000',
              NEXT_PUBLIC_BASE_PATH: '',
              NEXT_PUBLIC_MELDING_FORM_BASE_URL: 'http://127.0.0.1:3100',
              NEXTAUTH_URL: 'http://localhost:3102',
              PLAYWRIGHT_TEST: '1',
            },
            reuseExistingServer: false,
            timeout: 120_000,
            url: 'http://localhost:3102/robots.txt',
          },
        ]),
  ],
})
