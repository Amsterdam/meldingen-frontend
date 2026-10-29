import { expect, test } from '@playwright/test'
import { encode } from 'next-auth/jwt'

test.beforeEach(async ({ baseURL, context }) => {
  const secret = process.env.PLAYWRIGHT_AUTH_SECRET

  if (!secret) throw new Error('PLAYWRIGHT_AUTH_SECRET must be set by the Playwright configuration')
  if (!baseURL) throw new Error('The Back Office project must configure a baseURL')

  const sessionToken = await encode({
    secret,
    token: { sub: 'playwright-smoke-test' },
  })

  await context.addCookies([
    {
      httpOnly: true,
      name: 'next-auth.session-token',
      sameSite: 'Lax',
      url: baseURL,
      value: sessionToken,
    },
  ])
})

test('shows the Back Office not-found page for an unknown URL', async ({ page }) => {
  const response = await page.goto('/e2e-nonexistent-page')

  expect(response?.status()).toBe(404)
  await expect(page).toHaveURL('/e2e-nonexistent-page')
  await expect(page).toHaveTitle('Pagina niet gevonden - Gemeente Amsterdam')
  await expect(page.getByRole('heading', { level: 1, name: 'Pagina niet gevonden' })).toBeVisible()
  await expect(
    page.getByText(
      'Controleer of de link correct is. Als u de link heeft gekopieerd, controleer dan of u de gehele link heeft gekopieerd.',
      { exact: true },
    ),
  ).toBeVisible()
})
