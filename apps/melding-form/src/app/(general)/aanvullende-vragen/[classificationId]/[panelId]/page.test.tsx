import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import Page from './page'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('Page', () => {
  it('throws an error if form cannot be fetched by classification', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(null, { status: 500 })),
    )

    await expect(Page({ params: Promise.resolve({ classificationId: 1, panelId: 'panel-1' }) })).rejects.toThrowError(
      'Failed to fetch form by classification.',
    )
  })

  it('redirects to /locatie page if the first component is not a panel', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [{ type: 'not-panel' }],
        }),
      ),
    )

    await Page({ params: Promise.resolve({ classificationId: 1, panelId: 'panel-1' }) })

    expect(redirect).toHaveBeenCalledWith('/locatie')
  })
})
