import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import type {
  FormCheckboxComponentOutput,
  FormDateComponentOutput,
  FormOutput,
  FormPanelComponentOutput,
  FormRadioComponentOutput,
  FormSelectComponentOutput,
  GetMeldingByMeldingIdAnswersMelderResponses,
} from '@meldingen/api-client'

import { getFormClassificationByClassificationId, getMeldingByMeldingIdAnswersMelder } from '@meldingen/api-client'

import {
  AFTER_ADDITIONAL_QUESTIONS_PATH,
  getPreviousAnswersByKey,
  getPreviousPanelPath,
  isPanelComponentOutput,
} from './_utils/navigationUtils'
import { setDateComponentOptions } from './_utils/setDateComponentOptions'
import { postForm } from './actions'
import { AdditionalQuestions } from './AdditionalQuestions'
import { COOKIES } from 'apps/melding-form/src/constants'

export const dynamic = 'force-dynamic'

// The backend returns a 'position' key in each value-label object,
// but it does not accept that key when we send the answer back. For that reason, we strip it here.
const stripPositionKey = <T extends { position?: unknown }>(obj: T): Omit<T, 'position'> => {
  const { position: _position, ...rest } = obj
  return rest
}

export type DateOptionValues = {
  converted_date: string
  label: string
  value: string
}
export type FormDateComponentOutputWithValues = FormDateComponentOutput & { values: DateOptionValues[] }

const getValuesAndLabels = (component: FormOutputWithoutPanelComponents) => {
  switch (component.type) {
    case 'date':
      return (component as FormDateComponentOutputWithValues).values
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

export type FormOutputWithoutPanelComponents = Exclude<FormOutput['components'][number], FormPanelComponentOutput>

const prefillFormComponents = (
  components: FormOutputWithoutPanelComponents[],
  answers?: GetMeldingByMeldingIdAnswersMelderResponses['200'],
) =>
  components.map((component) => {
    const answer = answers?.find((answer) => answer.question.id === component.question)

    // Prefill if answer exists, otherwise return component without defaultValue(s)
    switch (answer?.type) {
      case 'date':
        return { ...component, defaultValue: answer.date.value }
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

  // Get current panel components
  const currentPanelIndex = data.components.findIndex((component) => component.key === panelId)
  const panel = data.components[currentPanelIndex]

  if (!isPanelComponentOutput(panel)) {
    redirect(AFTER_ADDITIONAL_QUESTIONS_PATH)
  }

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

  const formComponentsWithDateOptions = setDateComponentOptions(panelComponents)

  const questionMetadata = formComponentsWithDateOptions.map((component) => {
    const { key, question, type } = component
    const valuesAndLabels = getValuesAndLabels(component)

    return { id: question, key, type, valuesAndLabels }
  })

  const questionAndAnswerIdPairs = answers?.map((answer) => ({
    answerId: answer.id,
    questionId: answer.question.id,
  }))

  const requiredQuestionErrorMessages = panelComponents
    .filter((question) => question.validate?.required)
    .map(({ key, validate }) => ({
      key,
      requiredErrorMessage: validate?.required_error_message || t('required-error-message-fallback'),
    }))

  // We need the components conditions of all panels to determine the next and previous panel paths, so we extract them here.
  const panelComponentsConditions = data.components.filter(isPanelComponentOutput).map(({ components, key }) => ({
    componentsConditions: components.map(({ conditional, key }) => ({ conditional, key })),
    key,
  }))

  const previousAnswersByKey = getPreviousAnswersByKey(data, answers)

  const extraArgs = {
    classificationId,
    currentPanelIndex,
    panelComponentsConditions,
    previousAnswersByKey,
    questionAndAnswerIdPairs,
    questionMetadata,
    requiredQuestionErrorMessages,
  }

  // Pass extra arguments to the postForm action
  const postFormWithExtraArgs = postForm.bind(null, extraArgs)

  // Pass previous panel path to the Aanvullende vragen component
  const previousPanelPath = getPreviousPanelPath(
    classificationId,
    currentPanelIndex,
    panelComponentsConditions,
    previousAnswersByKey,
  )

  const prefilledFormComponents = prefillFormComponents(formComponentsWithDateOptions, answers)
  const formComponentsWithCorrectRenderTypes = prefilledFormComponents.map((component) => {
    // The date component is rendered as a radio component, so we change the type here.
    if (component.type === 'date') {
      return { ...component, type: 'radio' }
    }
    return component
  })

  return (
    <AdditionalQuestions
      action={postFormWithExtraArgs}
      formComponents={formComponentsWithCorrectRenderTypes}
      panelLabel={panelLabel}
      previousAnswersByKey={previousAnswersByKey}
      previousPanelPath={previousPanelPath}
    />
  )
}
