import { useTranslations } from 'next-intl'

import { Grid, Heading, TabNavigation } from '@meldingen/ui'

import { BackLink } from '../_components/BackLink'

type Props = {
  meldingId: number
  publicId: string
}

export const NotesOverview = ({ meldingId, publicId }: Props) => {
  const t = useTranslations('notes-overview')

  return (
    <div className="ams-page__area--body">
      <BackLink href={`/`}>{t('back-link')}</BackLink>
      <Grid as="main">
        <Grid.Cell appearance="transparent" span={{ narrow: 4, medium: 6, wide: 6 }}>
          <Heading className="ams-mb-l" level={1}>
            {t('title', { publicId })}
          </Heading>
          <TabNavigation className="ams-mb-l">
            <TabNavigation.List>
              {/* TODO: use linkComponent with a Next link here when it's available */}
              <TabNavigation.Link href={`/melding/${meldingId}`}>{t('tab-navigation.detail')}</TabNavigation.Link>
              <TabNavigation.Link aria-current="page" href={`/melding/${meldingId}/notities`}>
                {t('tab-navigation.notes')}
              </TabNavigation.Link>
            </TabNavigation.List>
          </TabNavigation>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
