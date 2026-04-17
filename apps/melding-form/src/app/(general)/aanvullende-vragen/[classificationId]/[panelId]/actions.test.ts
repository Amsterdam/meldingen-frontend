import type { Mock } from 'vitest'

import { http, HttpResponse } from 'msw'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type { ArgsType } from './actions'

import { postForm } from './actions'
import { COOKIES, TOP_ANCHOR_ID } from 'apps/melding-form/src/constants'
import { ENDPOINTS } from 'apps/melding-form/src/mocks/endpoints'
import { server } from 'apps/melding-form/src/mocks/node'
import { mockIdAndTokenCookies } from 'apps/melding-form/src/mocks/utils'

vi.mock('next/headers', () => ({ cookies: vi.fn() }))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

describe('postForm', () => {
  const defaultArgs: ArgsType = {
    classificationId: 1,
    currentPanelIndex: 1,
    panelComponentsConditions: [
      { componentsConditions: [{ key: 'question-1' }], key: 'panel-1' },
      { componentsConditions: [{ key: 'question-2' }], key: 'panel-2' },
    ],
    previousAnswersByKey: {},
    questionMetadata: [
      { id: 1, key: 'key1', type: 'textfield' },
      { id: 2, key: 'key2', type: 'textfield' },
    ],
    requiredQuestionErrorMessages: [],
  }

  beforeEach(() => {
    mockIdAndTokenCookies()
  })

  it('redirects to /cookie-storing when id or token is missing', async () => {
    // Override cookies mock for this specific test
    ;(cookies as Mock).mockReturnValue({
      get: () => undefined,
    })

    const formData = new FormData()
    await postForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalledWith(`/cookie-storing#${TOP_ANCHOR_ID}`)
  })

  it('returns a validation error when a Time component has a time value and its corresponding "unknown" checkbox is checked', async () => {
    const formData = new FormData()
    formData.append('time___timeQuestion', '12:00')
    formData.append('time___timeQuestion-unknown', 'on')

    const result = await postForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [
        {
          key: 'timeQuestion',
          message: 'Selecteer een tijd, of vink "Weet ik niet" aan.',
        },
      ],
    })
  })

  it('returns custom and fallback validation errors for missing required questions', async () => {
    const formData = new FormData()

    const result = await postForm(
      {
        ...defaultArgs,
        requiredQuestionErrorMessages: [
          { key: 'textArea1', requiredErrorMessage: 'required-error-message-fallback' },
          { key: 'selectBoxes', requiredErrorMessage: 'Dit veld is verplicht' },
        ],
      },
      null,
      formData,
    )

    expect(result).toEqual({
      formData,
      validationErrors: [
        { key: 'textArea1', message: 'required-error-message-fallback' },
        {
          key: 'selectBoxes',
          message: 'Dit veld is verplicht',
        },
      ],
    })
  })

  it('returns a validation error for a required question submitted with an empty value', async () => {
    const formData = new FormData()
    formData.append('key1', '')

    const result = await postForm(
      {
        ...defaultArgs,
        requiredQuestionErrorMessages: [{ key: 'key1', requiredErrorMessage: 'Dit veld is verplicht' }],
      },
      null,
      formData,
    )

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'key1', message: 'Dit veld is verplicht' }],
    })
  })

  it('does not return a required validation error when the required component is not visible', async () => {
    const formData = new FormData()

    const result = await postForm(
      {
        ...defaultArgs,
        currentPanelIndex: 0,
        panelComponentsConditions: [
          {
            componentsConditions: [
              {
                conditional: {
                  eq: 'yes',
                  show: true,
                  when: 'controller',
                },
                key: 'dependent',
              },
            ],
            key: 'panel-1',
          },
          { componentsConditions: [], key: 'panel-2' },
        ],
        previousAnswersByKey: { controller: 'no' },
        requiredQuestionErrorMessages: [{ key: 'dependent', requiredErrorMessage: 'Dit veld is verplicht' }],
      },
      null,
      formData,
    )

    expect(result).toBeUndefined()
    expect(redirect).toHaveBeenCalled()
  })

  it('skips results without a value when checking for validation errors', async () => {
    const formData = new FormData()
    formData.append('non-existent-key', 'some-value') // Not in questionMetadata, so result will be undefined

    await postForm(defaultArgs, null, formData)

    expect(redirect).toHaveBeenCalled()
  })

  it('returns validation errors for other invalid answers', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_QUESTION_BY_QUESTION_ID, () =>
        HttpResponse.json(
          { detail: [{ loc: ['key1'], msg: 'Validation error', type: 'value_error' }] },
          { status: 422 },
        ),
      ),
    )

    const formData = new FormData()
    formData.append('key1', 'value1')

    const result = await postForm(defaultArgs, null, formData)

    expect(result).toEqual({
      formData,
      validationErrors: [{ key: 'key1', message: 'Validation error' }],
    })
  })

  it('returns an error message if an error occurs when posting a single answer', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_QUESTION_BY_QUESTION_ID, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('key1', 'value1')

    const result = await postForm(defaultArgs, null, formData)

    expect(result).toEqual({ formData, systemError: ['Error message'] })
  })

  it('returns a merged error message if multiple errors occur when posting multiple answers', async () => {
    server.use(
      http.post(ENDPOINTS.POST_MELDING_BY_MELDING_ID_QUESTION_BY_QUESTION_ID, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )

    const formData = new FormData()
    formData.append('key1', 'value1')
    formData.append('key2', 'value2')

    const result = await postForm(defaultArgs, null, formData)

    expect(result).toEqual({ formData, systemError: ['Error message', 'Error message'] })
  })

  it('returns an error message if an error occurs when changing melding state', async () => {
    server.use(
      http.put(ENDPOINTS.PUT_MELDING_BY_MELDING_ID_ANSWER_QUESTIONS, () =>
        HttpResponse.json('Error message', { status: 500 }),
      ),
    )

    const formData = new FormData()

    const result = await postForm(defaultArgs, null, formData)

    expect(result).toEqual({ formData, systemError: 'Error message' })
  })

  it('sets lastPanelPath in cookies when on last page', async () => {
    const formData = new FormData()
    await postForm(defaultArgs, null, formData)

    const cookieInstance = await cookies()
    expect(cookieInstance.set).toHaveBeenCalledWith(
      COOKIES.LAST_PANEL_PATH,
      `/aanvullende-vragen/1/panel-2#${TOP_ANCHOR_ID}`,
      {
        maxAge: 86400,
      },
    )
  })
})
