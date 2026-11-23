import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'
import { loadEnvFile } from 'node:process'
import { fileURLToPath } from 'node:url'

import { getWebServers } from './getWebServers'

const envFile = fileURLToPath(new URL('./.env.local', import.meta.url))

if (existsSync(envFile)) {
  loadEnvFile(envFile)
}

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
      { baseURL: `${(meldingFormBaseURL || 'http://localhost:3100').replace(/\/$/, '')}/`, name: 'melding-form' },
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
  webServer: getWebServers({ backOfficeBaseURL, meldingFormBaseURL }),
})
