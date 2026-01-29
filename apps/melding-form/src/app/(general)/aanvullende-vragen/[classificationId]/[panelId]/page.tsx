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

const getNextPanelPath = (classificationId: number, currentPanelIndex: number, formData: FormOutput) => {
  if (currentPanelIndex === formData.components.length - 1) return '/locatie'

  return `/aanvullende-vragen/${classificationId}/${formData.components[currentPanelIndex + 1].key}`
}

const getPreviousPanelPath = (classificationId: number, currentPanelIndex: number, formData: FormOutput) => {
  if (currentPanelIndex === 0) return '/'

  return `/aanvullende-vragen/${classificationId}/${formData.components[currentPanelIndex - 1].key}`
}

// The backend returns a 'position' key in each value-label object,
// which we do not want to include in the question metadata.
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

type FormOutputWithoutPanelComponents = Exclude<FormOutput['components'][number], FormPanelComponentOutput>

const getFormComponents = (
  components: FormOutputWithoutPanelComponents[],
  answers?: GetMeldingByMeldingIdAnswersMelderResponses['200'],
) =>
  components.map((component) => {
    const answer = answers?.find((answer) => answer.question.id === component.question)

    // Prefill if answer exists, otherwise return component without defaultValue(s)
    switch (answer?.type) {
      case 'text':
        return { ...component, defaultValue: answer.text }
      case 'time':
        return { ...component, defaultValue: answer.time }
      case 'value_label':
        if (component.type === 'selectboxes') {
          return { ...component, defaultValues: answer.values_and_labels.map(({ value }) => value) }
        }
        return { ...component, defaultValue: answer.values_and_labels[0]?.value || '' }
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

  if (data.components[0].type !== 'panel') return redirect('/locatie')

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

  const isLastPanel = currentPanelIndex === data.components.length - 1
  const lastPanelPath = `/aanvullende-vragen/${classificationId}/${data.components[data.components.length - 1].key}`
  const nextPanelPath = getNextPanelPath(classificationId, currentPanelIndex, data)

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
  const previousPanelPath = getPreviousPanelPath(classificationId, currentPanelIndex, data)

  return (
    <AdditionalQuestions
      action={postFormWithExtraArgs}
      formComponents={formComponents}
      panelLabel={panelLabel}
      previousPanelPath={previousPanelPath}
    />
  )
}
