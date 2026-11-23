import type { PlaywrightTestConfig } from '@playwright/test'

type WebServer = Exclude<PlaywrightTestConfig['webServer'], undefined | unknown[]>

export const getWebServers = ({
  backOfficeBaseURL,
  meldingFormBaseURL,
}: {
  backOfficeBaseURL?: string
  meldingFormBaseURL?: string
}): WebServer[] => {
  const webServers: WebServer[] = []

  if (!meldingFormBaseURL) {
    webServers.push({
      command: 'pnpm --filter melding-form dev --hostname 127.0.0.1 --port 3100',
      env: {
        NEXT_DIST_DIR: '.next-e2e',
        NEXT_INTERNAL_BACKEND_BASE_URL: 'http://localhost:8000',
        NEXT_PUBLIC_BACK_OFFICE_BASE_URL: 'http://localhost:3102',
        NEXT_PUBLIC_BACKEND_BASE_URL: 'http://localhost:8000',
        NEXT_PUBLIC_MELDING_FORM_BASE_URL: 'http://127.0.0.1:3100',
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      url: 'http://127.0.0.1:3100/cookie-storing',
    })
  }

  if (!backOfficeBaseURL) {
    webServers.push({
      command: 'pnpm --filter back-office exec next dev --hostname localhost --port 3102',
      env: {
        NEXT_DIST_DIR: '.next-e2e',
        NEXT_INTERNAL_BACKEND_BASE_URL: 'http://localhost:8000',
        NEXT_PUBLIC_BACKEND_BASE_URL: 'http://localhost:8000',
        NEXT_PUBLIC_BASE_PATH: '',
        NEXT_PUBLIC_MELDING_FORM_BASE_URL: 'http://127.0.0.1:3100',
        NEXTAUTH_URL: 'http://localhost:3102',
      },
      reuseExistingServer: false,
      timeout: 120_000,
      url: 'http://localhost:3102/robots.txt',
    })
  }

  return webServers
}
