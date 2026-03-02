import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type {
  FormCheckboxComponentOutput,
  FormOutput,
  FormPanelComponentOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  GetMeldingByMeldingIdAnswersMelderResponses,
} from '@meldingen/api-client'

import { getFormClassificationByClassificationId, getMeldingByMeldingIdAnswersMelder } from '@meldingen/api-client'

import { postForm } from './actions'
import { AdditionalQuestions } from './AdditionalQuestions'
import { COOKIES } from 'apps/melding-form/src/constants'

export const dynamic = 'force-dynamic'

type Answers = GetMeldingByMeldingIdAnswersMelderResponses['200']
type FormOutputWithoutPanelComponents = Exclude<FormOutput['components'][number], FormPanelComponentOutput>

const BEFORE_ADDITIONAL_QUESTIONS_PATH = '/'
const AFTER_ADDITIONAL_QUESTIONS_PATH = '/locatie'

const getAnswerValue = (componentKey: string, formData: FormOutput, answers: Answers) => {
  for (const panel of formData.components) {
    if (panel.type !== 'panel') continue

    const match = (panel as FormPanelComponentOutput).components.find((component) => component.key === componentKey)

    if (!match) continue

    const answer = answers.find((answer) => answer.question.id === match.question)

    if (!answer) return null

    if (answer.type === 'text') return answer.text ?? null
    if (answer.type === 'time') return answer.time ?? null
    if (answer.type === 'value_label') return answer.values_and_labels?.[0]?.value ?? null
  }
  return null
}

const isComponentVisible = (component: FormOutputWithoutPanelComponents, formData: FormOutput, answers: Answers) => {
  const { conditional } = component

  if (!conditional || conditional.when === null || conditional.eq === null || conditional.show === null) return true

  const answerValue = getAnswerValue(conditional.when, formData, answers)
  const conditionMet = answerValue !== null && answerValue === String(conditional.eq)

  return conditionMet ? conditional.show : !conditional.show
}

// If a panel has at least one visible component, the panel is visible. Otherwise, the panel is hidden.
const isPanelVisible = (panel: FormPanelComponentOutput, formData: FormOutput, answers: Answers) =>
  panel.components.some((component) => isComponentVisible(component, formData, answers))

const getNextPanelPath = (
  classificationId: number,
  currentPanelIndex: number,
  formData: FormOutput,
  answers: Answers | undefined,
) => {
  for (let i = currentPanelIndex + 1; i < formData.components.length; i++) {
    const nextPanel = formData.components[i] as FormPanelComponentOutput

    if (!answers || isPanelVisible(nextPanel, formData, answers)) {
      return `/aanvullende-vragen/${classificationId}/${nextPanel.key}`
    }
  }
  return AFTER_ADDITIONAL_QUESTIONS_PATH
}

const getPreviousPanelPath = (
  classificationId: number,
  currentPanelIndex: number,
  formData: FormOutput,
  answers: Answers | undefined,
) => {
  for (let i = currentPanelIndex - 1; i >= 0; i--) {
    const previousPanel = formData.components[i] as FormPanelComponentOutput

    if (!answers || isPanelVisible(previousPanel, formData, answers)) {
      return `/aanvullende-vragen/${classificationId}/${previousPanel.key}`
    }
  }
  return BEFORE_ADDITIONAL_QUESTIONS_PATH
}

// The backend returns a 'position' key in each value-label object,
// but it does not accept that key when we send the answer back. For that reason, we strip it here.
const stripPositionKey = <T extends { position?: unknown }>(obj: T): Omit<T, 'position'> => {
  const { position: _position, ...rest } = obj
  return rest
}

const getValuesAndLabels = (component: FormOutputWithoutPanelComponents) => {
  switch (component.type) {
    case 'radio':
      return (component as FormRadioComponentOutput).values.map(stripPositionKey)
    case 'select':
      return (component as FormSelectComponentOutput).data.values.map(stripPositionKey)
    case 'selectboxes':
      return (component as FormCheckboxComponentOutput).values.map(stripPositionKey)
    default:
      return undefined
  }
}

const getFormComponents = (components: FormOutputWithoutPanelComponents[], answers?: Answers) =>
  components.map((component) => {
    const answer = answers?.find((answer) => answer.question.id === component.question)

    // Prefill if answer exists, otherwise return component without defaultValue(s)
    switch (answer?.type) {
      case 'text':
        return { ...component, defaultValue: answer.text }
      case 'time':
        return { ...component, defaultValue: answer.time }
      case 'value_label': {
        if (component.type === 'selectboxes') {
          return { ...component, defaultValues: answer.values_and_labels.map(({ value }) => value) }
        }
        return { ...component, defaultValue: answer.values_and_labels[0]?.value ?? undefined }
      }
      default:
        return component
    }
  })

type Params = Promise<{
  classificationId: number
  panelId: string
}>

export default async ({ params }: { params: Params }) => {
  const { classificationId, panelId } = await params
  const t = await getTranslations('additional-questions.errors')

  const { data, error } = await getFormClassificationByClassificationId({
    path: { classification_id: classificationId },
  })

  if (error) throw new Error('Failed to fetch form by classification.')

  if (data.components[0].type !== 'panel') return redirect(AFTER_ADDITIONAL_QUESTIONS_PATH)

  // Get current panel components
  const currentPanelIndex = data.components.findIndex((component) => component.key === panelId)
  const panel = data.components[currentPanelIndex] as FormPanelComponentOutput
  const panelComponents = panel.components
  const panelLabel = panel.label

  // Check if answers already exist and prefill if so
  const cookieStore = await cookies()
  // We check for the existence of these cookies in our proxy, so non-null assertion is safe here.
  const meldingId = cookieStore.get(COOKIES.ID)!.value
  const token = cookieStore.get(COOKIES.TOKEN)!.value

  const { data: answers, error: answersError } = await getMeldingByMeldingIdAnswersMelder({
    path: { melding_id: parseInt(meldingId, 10) },
    query: { token },
  })

  if (answersError) {
    // TODO: Log the error to an error reporting service
    // eslint-disable-next-line no-console
    console.error(answersError)
  }

  const formComponents = getFormComponents(panelComponents, answers)

  const questionAndAnswerIdPairs = answers?.map((answer) => ({
    answerId: answer.id,
    questionId: answer.question.id,
  }))

  const questionMetadata = panelComponents.map((component) => {
    const { key, question, type } = component
    const valuesAndLabels = getValuesAndLabels(component)

    return { id: question, key, type, valuesAndLabels }
  })

  const requiredQuestionKeysWithErrorMessages = panelComponents
    .filter((question) => question.validate?.required)
    .map(({ key, validate }) => ({
      key,
      requiredErrorMessage: validate?.required_error_message || t('required-error-message-fallback'),
    }))

  const nextPanelPath = getNextPanelPath(classificationId, currentPanelIndex, data, answers)
  const isLastPanel = nextPanelPath === AFTER_ADDITIONAL_QUESTIONS_PATH
  const lastPanelPath = `/aanvullende-vragen/${classificationId}/${data.components[data.components.length - 1].key}`

  const extraArgs = {
    isLastPanel,
    lastPanelPath,
    nextPanelPath,
    questionAndAnswerIdPairs,
    questionMetadata,
    requiredQuestionKeysWithErrorMessages,
  }

  // Pass extra arguments to the postForm action
  const postFormWithExtraArgs = postForm.bind(null, extraArgs)

  // Pass previous panel path to the Aanvullende vragen component
  const previousPanelPath = getPreviousPanelPath(classificationId, currentPanelIndex, data, answers)

  return (
    <AdditionalQuestions
      action={postFormWithExtraArgs}
      formComponents={formComponents}
      panelLabel={panelLabel}
      previousPanelPath={previousPanelPath}
    />
  )
}
