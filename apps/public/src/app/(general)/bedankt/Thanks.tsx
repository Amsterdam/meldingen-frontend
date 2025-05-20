'use client'

import { Heading, Link } from '@amsterdam/design-system-react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Grid } from '@meldingen/ui'

type Props = {
  publicId: string
}

export const Thanks = ({ publicId }: Props) => {
  const t = useTranslations('thanks')

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <Heading className="ams-mb-m" level={1}>
          {t('title')}
        </Heading>
        <MarkdownToHtml className="ams-mb-m">{t('description', { publicId })}</MarkdownToHtml>
        <NextLink href="/" legacyBehavior passHref>
          <Link href="dummy-href">{t('link')}</Link>
        </NextLink>
      </Grid.Cell>
    </Grid>
  )
}
