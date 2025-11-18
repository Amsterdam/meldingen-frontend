import { getTranslations } from 'next-intl/server'
import NextLink from 'next/link'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Footer, Grid, Header, Heading, Page, StandaloneLink } from '@meldingen/ui'

export const generateMetadata = async () => {
  const t = await getTranslations('not-found')

  return {
    title: t('metadata.title'),
  }
}

export default async function NotFound() {
  const t = await getTranslations('not-found')

  return (
    <Page>
      <Header />
      <Grid paddingBottom="x-large">
        <Grid.Cell span={{ medium: 6, narrow: 4, wide: 6 }} start={{ medium: 2, narrow: 1, wide: 3 }}>
          <main>
            <Heading className="ams-mb-m" level={1}>
              {t('title')}
            </Heading>
            <MarkdownToHtml className="ams-mb-s">{t('description')}</MarkdownToHtml>
            <NextLink href="/" legacyBehavior passHref>
              <StandaloneLink>{t('link')}</StandaloneLink>
            </NextLink>
          </main>
        </Grid.Cell>
      </Grid>
      <Footer />
    </Page>
  )
}
