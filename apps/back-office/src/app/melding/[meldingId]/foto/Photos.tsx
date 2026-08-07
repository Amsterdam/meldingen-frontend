import { useTranslations } from 'next-intl'

import { Grid, Heading } from '@meldingen/ui'

import { BackLink } from '../_components/BackLink'
import { ImageSlider } from './_components/ImageSlider'

export const Photos = ({ images, meldingId }: { images: (Blob | File)[]; meldingId: number }) => {
  const t = useTranslations('photos')

  return (
    <div className="ams-page__area--body">
      <BackLink href={`/melding/${meldingId}`}>{t('back-link')}</BackLink>
      <Grid as="main" gapVertical="large">
        <Grid.Cell span="all">
          <Heading className="ams-mb-m" id="heading" level={1}>
            {t('title')}
          </Heading>
          <ImageSlider images={images} labelId="heading" />
        </Grid.Cell>
      </Grid>
    </div>
  )
}
