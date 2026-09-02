import { useTranslations } from 'next-intl'

import { Grid, Heading } from '@meldingen/ui'

import { BackLink } from '../_components/BackLink'
import { ImageSlider } from './_components/ImageSlider'

type Props = {
  defaultSlideIndex?: number
  images: {
    createdAt: string
    data: Blob | File
    filename: string
    id: number
  }[]
  meldingId: number
}

export const Photos = ({ defaultSlideIndex, images, meldingId }: Props) => {
  const t = useTranslations('photos')

  return (
    <div className="ams-page__area--body">
      <BackLink href={`/melding/${meldingId}`}>{t('back-link')}</BackLink>
      <Grid as="main" gapVertical="large">
        <Grid.Cell appearance="transparent" span="all">
          <Heading className="ams-mb-m" id="heading" level={1}>
            {t('title')}
          </Heading>
          <ImageSlider defaultSlideIndex={defaultSlideIndex} images={images} labelId="heading" />
        </Grid.Cell>
      </Grid>
    </div>
  )
}
