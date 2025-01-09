import type { FormPanelComponentOutput } from '@meldingen/api-client'

import { getFormClassificationByClassificationId } from 'apps/public/src/apiClient'

import { AanvullendeVragen } from './AanvullendeVragen'
import { postForm } from './actions'

// TODO: pagina's die niet bestaan moeten redirect krijgen
// TODO: pagina's die wel bestaan maar geen token in url param moeten redirect krijgen

// TODO: Force dynamic rendering for now, because the api isn't accessible in the pipeline yet.
// We can remove this and uncomment generateStaticParams when the api is deployed.
export const dynamic = 'force-dynamic'

// export const generateStaticParams = async () => {
//   // Fetch a list of all forms
//   const forms = await getForm()

//   // Use classification id to get the panel ids per form
//   const panelIdsByForm = await Promise.all(
//     forms
//       .filter((form) => form.classification)
//       .map(async (form) => {
//         const formByClassification = await getFormClassificationByClassificationId({
//           classificationId: form.classification as number,
//         })

//         const panelIds = formByClassification?.components.map((panel) => ({
//           classification: `${form.classification}`,
//           panelId: panel.key,
//         }))

//         return panelIds
//       }),
//   )

//   return panelIdsByForm.flat()
// }

type Params = Promise<{
  classification: number
  panelId: string
}>

const getNextPanelPath = (classification: number, currentPanelIndex: number, formData: any) => {
  if (currentPanelIndex === formData.components.length - 1) return '/locatie'

  return `/aanvullende-vragen/${classification}/${formData.components[currentPanelIndex + 1].key}`
}

const getPreviousPanelPath = (classification: number, currentPanelIndex: number, formData: any) => {
  if (currentPanelIndex === 0) return '/'

  return `/aanvullende-vragen/${classification}/${formData.components[currentPanelIndex - 1].key}`
}

export default async ({ params }: { params: Params }) => {
  const { classification, panelId } = await params

  const formData = await getFormClassificationByClassificationId({ classificationId: classification })

  if (formData.components[0].type !== 'panel') return undefined

  // Get current panel questions
  const currentPanelIndex = formData.components.findIndex((component) => component.key === panelId)
  const panel = formData.components[currentPanelIndex] as FormPanelComponentOutput
  const panelQuestions = panel.components

  // Pass question ids to the action
  const questionIds = panelQuestions.map((question) => ({
    key: question.key,
    id: question.question,
  }))

  // Pass isLastPanel to the action
  const isLastPanel = currentPanelIndex === formData.components.length - 1

  // Pass last panel path to the action
  const lastPanelPath = `/aanvullende-vragen/${classification}/${formData.components[formData.components.length - 1].key}`

  // Pass next panel path to the action
  const nextPanelPath = getNextPanelPath(classification, currentPanelIndex, formData)

  const extraArgs = {
    isLastPanel,
    lastPanelPath,
    nextPanelPath,
    questionIds,
  }

  const postFormWithExtraArgs = postForm.bind(null, extraArgs)

  // Pass previous panel path to the Aanvullende vragen component
  const previousPanelPath = getPreviousPanelPath(classification, currentPanelIndex, formData)

  return (
    <AanvullendeVragen action={postFormWithExtraArgs} formData={panelQuestions} previousPanelPath={previousPanelPath} />
  )
}
