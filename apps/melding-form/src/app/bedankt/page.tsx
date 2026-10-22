import type { Metadata } from 'next'

import { getTranslations } from 'next-intl/server'
import NextLink from 'next/link'

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

  const { created_at, id: isParam, public_id, source: sourceParam } = await searchParams
  const createdAt = Array.isArray(created_at) ? created_at[0] : created_at
  const id = Array.isArray(isParam) ? isParam[0] : isParam
  const publicId = Array.isArray(public_id) ? public_id[0] : public_id
  const source = Array.isArray(sourceParam) ? sourceParam[0] : sourceParam

  const { date, time } = createdAt ? formatDateString(createdAt) : { date: undefined, time: undefined }

  const backOfficeBaseUrl = clientEnv.NEXT_PUBLIC_BACK_OFFICE_BASE_URL
  const publicIdLinkOrText =
    source === 'back-office' && publicId && id && backOfficeBaseUrl
      ? `[${publicId}](${backOfficeBaseUrl}/melding/${id}?id=${encodeURIComponent(publicId)})`
      : publicId

  const description = t('description', { date, publicId: publicIdLinkOrText, time })

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
