'use client'

import { Grid, Heading, Paragraph } from '@amsterdam/design-system-react'
import { SummaryList } from '@meldingen/ui'

import { BackLink } from '../_components/BackLink'

import type { SummaryData } from './page'

type Props = {
  data: SummaryData
}

export const Summary = ({ data }: Props) => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
      <BackLink href="/contact" className="ams-mb--xs">
        Vorige vraag
      </BackLink>
      <Heading className="ams-mb--sm">Samenvatting</Heading>

      <Heading level={2}>Versturen</Heading>
      <Paragraph className="ams-mb--sm">Controleer uw gegevens en verstuur uw melding.</Paragraph>

      <SummaryList>
        {data.map((item) => (
          <SummaryList.Item key={item?.key}>
            <SummaryList.Term>{item?.term}</SummaryList.Term>
            <SummaryList.Description>{item?.description}</SummaryList.Description>
          </SummaryList.Item>
        ))}
      </SummaryList>
    </Grid.Cell>
  </Grid>
)
