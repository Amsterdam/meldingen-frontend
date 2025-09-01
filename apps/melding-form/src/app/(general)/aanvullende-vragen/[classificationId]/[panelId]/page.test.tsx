import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Mock } from 'vitest'

import * as actionsModule from './actions'
import { AdditionalQuestions } from './AdditionalQuestions'
import Page from './page'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockReturnValue({
    get: vi.fn(),
  }),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('./actions', () => ({ postForm: vi.fn() }))

let capturedAction: ((argsObj: unknown, _: unknown, formData: FormData) => void) | null = null

vi.mock('./AdditionalQuestions', () => ({
  AdditionalQuestions: vi.fn((props: { action: () => void }) => {
    capturedAction = props.action
    return <div>AdditionalQuestions Component</div>
  }),
}))

const mockIdAndTokenCookies = (id = '123', token = 'test-token') => {
  ;(cookies as Mock).mockReturnValue({
    get: (name: string) => {
      if (name === 'id') return { value: id }
      if (name === 'token') return { value: token }
      return undefined
    },
    set: vi.fn(),
  })
}

describe('Page', () => {
  beforeEach(() => {
    mockIdAndTokenCookies()
  })

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

  it('passes postForm with the correct bounded args to AdditionalQuestions', async () => {
    const formData = {
      components: [
        { key: 'panel-1', type: 'panel', label: 'Panel 1', components: [{ key: 'question-1', question: 'q1' }] },
        {
          key: 'panel-2',
          type: 'panel',
          label: 'Panel 2',
          components: [{ key: 'question-2', question: 'q2', validate: { required: true } }],
        },
      ],
    }

    server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(formData)))

    const PageComponent = await Page({ params: Promise.resolve({ classificationId: 1, panelId: 'panel-2' }) })

    render(PageComponent)

    // Call the bound action
    if (capturedAction) {
      capturedAction({}, undefined, new FormData())
    }

    expect(actionsModule.postForm).toHaveBeenCalled()

    const [extraArgs] = (actionsModule.postForm as Mock).mock.calls[0]

    expect(extraArgs).toMatchObject({
      isLastPanel: true,
      lastPanelPath: '/aanvullende-vragen/1/panel-2',
      nextPanelPath: '/locatie',
      questionKeysAndIds: [{ key: 'question-2', id: 'q2' }],
      requiredQuestionKeys: ['question-2'],
    })
  })

  it('passes postForm with the correct bounded args to AdditionalQuestions when not on last panel', async () => {
    const formData = {
      components: [
        { key: 'panel-1', type: 'panel', label: 'Panel 1', components: [{ key: 'question-1', question: 'q1' }] },
        {
          key: 'panel-2',
          type: 'panel',
          label: 'Panel 2',
          components: [{ key: 'question-2', question: 'q2', validate: { required: true } }],
        },
      ],
    }

    server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(formData)))

    const PageComponent = await Page({ params: Promise.resolve({ classificationId: 1, panelId: 'panel-1' }) })

    render(PageComponent)

    // Call the bound action
    if (capturedAction) {
      capturedAction({}, undefined, new FormData())
    }

    expect(actionsModule.postForm).toHaveBeenCalled()

    const [extraArgs] = (actionsModule.postForm as Mock).mock.calls[0]

    expect(extraArgs).toMatchObject({
      isLastPanel: false,
      lastPanelPath: '/aanvullende-vragen/1/panel-2',
      nextPanelPath: '/aanvullende-vragen/1/panel-2',
      questionKeysAndIds: [{ key: 'question-1', id: 'q1' }],
      requiredQuestionKeys: [],
    })
  })
})
