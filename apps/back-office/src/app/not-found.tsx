import { getTranslations } from 'next-intl/server'

import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Grid, Heading } from '@meldingen/ui'

export const generateMetadata = async () => {
  const t = await getTranslations('not-found')

  return {
    title: t('metadata.title'),
  }
}

export default async function NotFound() {
  const t = await getTranslations('not-found')

  return (
    <div className="ams-page__area--body">
      <Grid>
        <Grid.Cell
          appearance="transparent"
          rowStart={4}
          span={{ narrow: 4, medium: 6, wide: 6 }}
          start={{ narrow: 1, medium: 2, wide: 4 }}
        >
          <main>
            <Heading className="ams-mb-m" level={1}>
              {t('title')}
            </Heading>
            <MarkdownToHtml className="ams-mb-s">{t('description')}</MarkdownToHtml>
          </main>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
