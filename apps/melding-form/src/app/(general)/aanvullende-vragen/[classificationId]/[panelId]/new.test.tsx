import { render } from '@testing-library/react'
import { http, HttpResponse } from 'msw'

import * as actionsModule from './actions'
import Page from './page'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'

vi.mock('./actions', () => ({ postForm: vi.fn() }))

let capturedAction: any = null
vi.mock('./AdditionalQuestions', () => ({
  AdditionalQuestions: (props: any) => {
    capturedAction = props.action
    return <div data-testid="additional-questions" />
  },
}))

describe('page extraArgs', () => {
  afterEach(() => {
    capturedAction = null

    // Clear the spy via the mocked module
    ;(actionsModule.postForm as any).mockClear()
  })

  it('calls postForm with correct extraArgs when action is invoked', async () => {
    const formData = {
      components: [
        { key: 'panel-1', type: 'panel', label: 'Panel 1', components: [{ key: 'question-1', question: 'q1' }] },
        { key: 'panel-2', type: 'panel', label: 'Panel 2', components: [{ key: 'question-2', question: 'q2' }] },
      ],
    }

    server.use(http.get(ENDPOINTS.GET_FORM_CLASSIFICATION_BY_CLASSIFICATION_ID, () => HttpResponse.json(formData)))

    const PageComponent = await Page({ params: Promise.resolve({ classificationId: 1, panelId: 'panel-2' }) })

    render(PageComponent)

    // Call the bound action
    await capturedAction({}, undefined, new FormData())

    // Assert the arguments passed to the original spy
    expect(actionsModule.postForm).toHaveBeenCalled()
    const [extraArgs] = (actionsModule.postForm as any).mock.calls[0]
    expect(extraArgs).toMatchObject({
      isLastPanel: false,
      lastPanelPath: '/aanvullende-vragen/123/panel2',
      nextPanelPath: '/aanvullende-vragen/123/panel2',
      questionKeysAndIds: [
        { key: 'q1', id: 1 },
        { key: 'q2', id: 2 },
      ],
      requiredQuestionKeys: ['q1'],
    })
  })
})
