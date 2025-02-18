'use client'

import { Grid, Heading, Paragraph } from '@amsterdam/design-system-react'
import { SubmitButton, SummaryList } from '@meldingen/ui'
import { useActionState } from 'react'

import { BackLink } from '../_components/BackLink'

import { postSummaryForm } from './actions'
import type { SummaryData } from './page'

type Props = {
  data: SummaryData
}

const initialState: { message?: string } = {}

export const Summary = ({ data }: Props) => {
  const [formState, formAction] = useActionState(postSummaryForm, initialState)

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink href="/contact" className="ams-mb--xs">
          Vorige vraag
        </BackLink>
        <Heading className="ams-mb--sm">Samenvatting</Heading>

        <Heading level={2} className="ams-mb--xs">
          Versturen
        </Heading>
        <Paragraph className="ams-mb--sm">Controleer uw gegevens en verstuur uw melding.</Paragraph>

        {formState?.message && <Paragraph>{formState.message}</Paragraph>}

        <SummaryList className="ams-mb--sm">
          {data.map(({ key, term, description }) => (
            <SummaryList.Item key={key}>
              <SummaryList.Term>{term}</SummaryList.Term>
              {description.map((item) => (
                <SummaryList.Description key={item}>{item}</SummaryList.Description>
              ))}
            </SummaryList.Item>
          ))}
        </SummaryList>
        <form action={formAction}>
          <SubmitButton>Verstuur melding</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
