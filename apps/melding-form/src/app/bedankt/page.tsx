import type { Metadata } from 'next'

import { getTranslations } from 'next-intl/server'
import NextLink from 'next/link'

import { getClassification } from '@meldingen/api-client'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Heading, StandaloneLink } from '@meldingen/ui'
import { formatDateString } from '@meldingen/utils'

import { BackOfficeLayout, RegularLayout } from '../_components'
import { TOP_ANCHOR_ID } from '~/constants'
import { clientEnv } from '~/env/client'

type Props = Pick<PageProps<'/bedankt'>, 'searchParams'>

// The "description" translation also accepts undefined values for conditional rendering
type TWithUndefined = (key: string, values?: Record<string, string | number | Date | undefined>) => string

export const generateMetadata = async (): Promise<Metadata> => {
  const t = await getTranslations('thanks')

  return {
    title: t('metadata.title'),
  }
}

export default async ({ searchParams }: Props) => {
  const t = (await getTranslations('thanks')) as TWithUndefined

  const { classification_id, created_at, id: idParam, public_id, source: sourceParam } = await searchParams
  const createdAt = Array.isArray(created_at) ? created_at[0] : created_at
  const classificationId = Array.isArray(classification_id) ? classification_id[0] : classification_id

  const { data: classification } = classificationId
    ? await getClassification({ query: { filter: JSON.stringify({ id_in: [Number(classificationId)] }) } })
    : { data: undefined }

  const serviceLevelObjectiveText = classification?.[0]?.service_level_objective_text || undefined
  const id = Array.isArray(idParam) ? idParam[0] : idParam
  const publicId = Array.isArray(public_id) ? public_id[0] : public_id
  const source = Array.isArray(sourceParam) ? sourceParam[0] : sourceParam

  const { date, time } = createdAt ? formatDateString(createdAt) : { date: undefined, time: undefined }

  const backOfficeBaseUrl = clientEnv.NEXT_PUBLIC_BACK_OFFICE_BASE_URL
  const publicIdLinkOrText =
    source === 'back-office' && publicId && id && backOfficeBaseUrl
      ? `[${publicId}](${backOfficeBaseUrl}/melding/${id}?id=${encodeURIComponent(publicId)})`
      : publicId

  const description = t('description', { date, publicId: publicIdLinkOrText, serviceLevelObjectiveText, time })

  const returnLink = source === 'back-office' ? `${backOfficeBaseUrl}/melden` : `/#${TOP_ANCHOR_ID}`

  const Layout = source === 'back-office' ? BackOfficeLayout : RegularLayout

  return (
    <Layout>
      <main>
        <Heading className="ams-mb-m" level={1}>
          {t('title')}
        </Heading>
        <MarkdownToHtml className="ams-mb-s">{description}</MarkdownToHtml>
        <StandaloneLink href={returnLink} linkComponent={NextLink}>
          {t('link')}
        </StandaloneLink>
      </main>
    </Layout>
  )
}
