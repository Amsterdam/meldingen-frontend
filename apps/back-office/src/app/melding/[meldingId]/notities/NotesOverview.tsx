import { useTranslations } from 'next-intl'

import { Grid, Heading, TabNavigation } from '@meldingen/ui'

import { BackLink } from '../_components/BackLink'
import { NextLink } from '~/app/_components'

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
              <TabNavigation.Link href={`/melding/${meldingId}`} linkComponent={NextLink}>
                {t('tab-navigation.detail')}
              </TabNavigation.Link>
              <TabNavigation.Link aria-current="page" href={`/melding/${meldingId}/notities`} linkComponent={NextLink}>
                {t('tab-navigation.notes')}
              </TabNavigation.Link>
            </TabNavigation.List>
          </TabNavigation>
        </Grid.Cell>
      </Grid>
    </div>
  )
}
