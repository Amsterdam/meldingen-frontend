import { render, screen } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { redirect } from 'next/navigation'
import { Mock } from 'vitest'

import * as actionsModule from './actions'
import { AdditionalQuestions } from './AdditionalQuestions'
import Page from './page'
import { additionalQuestions } from 'apps/melding-form/src/mocks/data'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

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

const defaultProps = { params: Promise.resolve({ classificationId: 1, panelId: 'panel-1' }) }

describe('Page', () => {
  beforeEach(() => {
    mockIdAndTokenCookies()
  })

  it('throws an error if form cannot be fetched by classification', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(null, { status: 500 })),
    )

    await expect(Page(defaultProps)).rejects.toThrowError('Failed to fetch form by classification.')
  })

  it('redirects to /locatie page if the first component is not a panel', async () => {
    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () =>
        HttpResponse.json({
          components: [{ type: 'not-panel' }],
        }),
      ),
    )

    await Page(defaultProps)

    expect(redirect).toHaveBeenCalledWith('/locatie')
  })

  it('renders the AdditionalQuestions component with correct props', async () => {
    const formData = {
      components: [
        { components: [{ key: 'question-1', question: 'q1' }], key: 'panel-1', label: 'Panel 1', type: 'panel' },
        { components: [{ key: 'question-2', question: 'q2' }], key: 'panel-2', label: 'Panel 2', type: 'panel' },
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
      undefined,
    )
  })

  it('renders the AdditionalQuestions component with prefilled form components', async () => {
    const formData = {
      components: [
        {
          components: [{ key: 'question-1', question: additionalQuestions[0].question.id }],
          key: 'panel-1',
          label: 'Panel 1',
          type: 'panel',
        },
      ],
    }

    server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(formData)))

    const PageComponent = await Page(defaultProps)

    render(PageComponent)

    expect(AdditionalQuestions).toHaveBeenCalledWith(
      expect.objectContaining({
        action: expect.any(Function),
        formComponents: [
          {
            defaultValue: additionalQuestions[0].text,
            key: 'question-1',
            question: additionalQuestions[0].question.id,
          },
        ],
        panelLabel: 'Panel 1',
        previousPanelPath: '/',
      }),
      undefined,
    )
  })

  // TODO: temporarily skipped because we don't handle prefilling correctly yet
  it.skip('renders the AdditionalQuestions component with prefilled checkbox components', async () => {
    const formData = {
      components: [
        {
          components: [{ key: 'question-1', question: 'q1', type: 'selectboxes' }],
          key: 'panel-1',
          label: 'Panel 1',
          type: 'panel',
        },
      ],
    }

    server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(formData)))

    server.use(
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
        // TODO: Temporarily mock this as a text answer for now. We should handle all answer types when the BE is done with their multiple answer types work.
        HttpResponse.json([{ id: 'answer-1', question: { id: 'q1' }, text: 'One, Two', type: 'text' }]),
      ),
    )

    const PageComponent = await Page(defaultProps)

    render(PageComponent)

    expect(screen.getByText('AdditionalQuestions Component')).toBeInTheDocument()
    expect(AdditionalQuestions).toHaveBeenCalledWith(
      expect.objectContaining({
        action: expect.any(Function),
        formComponents: [{ defaultValues: ['One', 'Two'], key: 'question-1', question: 'q1', type: 'selectboxes' }],
        panelLabel: 'Panel 1',
        previousPanelPath: '/',
      }),
      undefined,
    )
  })

  it('logs an error to the console when the answers for additional questions cannot be fetched', async () => {
    const formData = {
      components: [
        { components: [{ key: 'question-1', question: 'q1' }], key: 'panel-1', label: 'Panel 1', type: 'panel' },
      ],
    }

    server.use(
      http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(formData)),
      http.get(ENDPOINTS.GET_MELDING_BY_MELDING_ID_ANSWERS_MELDER, () =>
        HttpResponse.json('Test error', { status: 500 }),
      ),
    )

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const PageComponent = await Page(defaultProps)

    render(PageComponent)

    expect(consoleSpy).toHaveBeenCalledWith('Test error')

    consoleSpy.mockRestore()
  })

  it('passes postForm with the correct bounded args to AdditionalQuestions', async () => {
    const formData = {
      components: [
        {
          components: [{ key: 'question-1', question: 'q1', type: 'textfield' }],
          key: 'panel-1',
          label: 'Panel 1',
          type: 'panel',
        },
        {
          components: [{ key: 'question-2', question: 'q2', type: 'textfield', validate: { required: true } }],
          key: 'panel-2',
          label: 'Panel 2',
          type: 'panel',
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
      questionAndAnswerIdPairs: [
        { answerId: additionalQuestions[0].id, questionId: additionalQuestions[0].question.id },
        { answerId: additionalQuestions[1].id, questionId: additionalQuestions[1].question.id },
      ],
      questionMetadata: [{ id: 'q2', key: 'question-2', type: 'textfield' }],
      requiredQuestionKeysWithErrorMessages: [
        { key: 'question-2', requiredErrorMessage: 'required-error-message-fallback' },
      ],
    })
  })

  it('passes postForm with the correct bounded args to AdditionalQuestions when not on last panel', async () => {
    const formData = {
      components: [
        {
          components: [{ key: 'question-1', question: 'q1', type: 'textfield' }],
          key: 'panel-1',
          label: 'Panel 1',
          type: 'panel',
        },
        {
          components: [{ key: 'question-2', question: 'q2', type: 'textfield', validate: { required: true } }],
          key: 'panel-2',
          label: 'Panel 2',
          type: 'panel',
        },
      ],
    }

    server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(formData)))

    const PageComponent = await Page(defaultProps)

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
      questionMetadata: [{ id: 'q1', key: 'question-1', type: 'textfield' }],
      requiredQuestionKeysWithErrorMessages: [],
    })
  })

  it('passes postForm with the correct bounded args to AdditionalQuestions when there is a radio question', async () => {
    const formData = {
      components: [
        {
          components: [
            {
              key: 'question-1',
              question: 'q1',
              type: 'radio',
              values: [{ label: 'Label 1', position: 1, value: 'value1' }],
            },
          ],
          key: 'panel-1',
          label: 'Panel 1',
          type: 'panel',
        },
      ],
    }

    server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(formData)))

    const PageComponent = await Page(defaultProps)

    render(PageComponent)

    // Call the bound action
    if (capturedAction) {
      capturedAction({}, undefined, new FormData())
    }

    expect(actionsModule.postForm).toHaveBeenCalled()

    const [extraArgs] = (actionsModule.postForm as Mock).mock.calls[0]

    expect(extraArgs).toMatchObject({
      questionMetadata: [
        { id: 'q1', key: 'question-1', type: 'radio', valuesAndLabels: [{ label: 'Label 1', value: 'value1' }] },
      ],
    })
  })

  it('passes postForm with the correct bounded args to AdditionalQuestions when there is a select question', async () => {
    const formData = {
      components: [
        {
          components: [
            {
              data: { values: [{ label: 'Label 1', position: 1, value: 'value1' }] },
              key: 'question-1',
              question: 'q1',
              type: 'select',
            },
          ],
          key: 'panel-1',
          label: 'Panel 1',
          type: 'panel',
        },
      ],
    }

    server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(formData)))

    const PageComponent = await Page(defaultProps)

    render(PageComponent)

    // Call the bound action
    if (capturedAction) {
      capturedAction({}, undefined, new FormData())
    }

    expect(actionsModule.postForm).toHaveBeenCalled()

    const [extraArgs] = (actionsModule.postForm as Mock).mock.calls[0]

    expect(extraArgs).toMatchObject({
      questionMetadata: [
        { id: 'q1', key: 'question-1', type: 'select', valuesAndLabels: [{ label: 'Label 1', value: 'value1' }] },
      ],
    })
  })

  it('passes postForm with the correct bounded args to AdditionalQuestions when there is a selectboxes (checkbox) question', async () => {
    const formData = {
      components: [
        {
          components: [
            {
              key: 'question-1',
              question: 'q1',
              type: 'selectboxes',
              values: [{ label: 'Label 1', position: 1, value: 'value1' }],
            },
          ],
          key: 'panel-1',
          label: 'Panel 1',
          type: 'panel',
        },
      ],
    }

    server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(formData)))

    const PageComponent = await Page(defaultProps)

    render(PageComponent)

    // Call the bound action
    if (capturedAction) {
      capturedAction({}, undefined, new FormData())
    }

    expect(actionsModule.postForm).toHaveBeenCalled()

    const [extraArgs] = (actionsModule.postForm as Mock).mock.calls[0]

    expect(extraArgs).toMatchObject({
      questionMetadata: [
        { id: 'q1', key: 'question-1', type: 'selectboxes', valuesAndLabels: [{ label: 'Label 1', value: 'value1' }] },
      ],
    })
  })
})
