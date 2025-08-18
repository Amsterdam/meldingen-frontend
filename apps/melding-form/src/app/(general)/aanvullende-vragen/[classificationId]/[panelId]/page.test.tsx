import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'

import { AdditionalQuestions } from './AdditionalQuestions'
import Page from './page'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('./AdditionalQuestions', () => ({
  AdditionalQuestions: vi.fn(() => <div>AdditionalQuestions Component</div>),
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

  it('renders the AdditionalQuestions component with correct props', async () => {
    const formData = {
      components: [
        { key: 'panel-1', type: 'panel', label: 'Panel 1', components: [{ key: 'question-1', question: 'q1' }] },
        { key: 'panel-2', type: 'panel', label: 'Panel 2', components: [{ key: 'question-2', question: 'q2' }] },
      ],
    }

    server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(formData)))

    const PageComponent = await Page({ params: Promise.resolve({ classificationId: 1, panelId: 'panel-2' }) })

    render(PageComponent)

    expect(screen.getByText('AdditionalQuestions Component')).toBeInTheDocument()
    expect(AdditionalQuestions).toHaveBeenCalledWith(
      expect.objectContaining({
        action: expect.any(Function),
        formComponents: [{ key: 'question-2', question: 'q2' }],
        panelLabel: 'Panel 2',
        previousPanelPath: '/aanvullende-vragen/1/panel-1',
      }),
      {},
    )
  })
})
