'use client'

import { Grid, Heading, Paragraph } from '@amsterdam/design-system-react'
import { SubmitButton, SummaryList } from '@meldingen/ui'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { BackLink } from '../_components/BackLink'

import { postSummaryForm } from './actions'

type Props = {
  data: {
    key: string
    term: string
    description: string[]
  }[]
}

const initialState: { message?: string } = {}

export const Summary = ({ data }: Props) => {
  const [formState, formAction] = useActionState(postSummaryForm, initialState)

  const t = useTranslations('summary')

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <BackLink href="/contact" className="ams-mb--xs">
          {t('back-link')}
        </BackLink>
        <Heading className="ams-mb--sm">{t('step.title')}</Heading>

        <Heading level={2} size="level-4" className="ams-mb--xs">
          {t('title')}
        </Heading>
        <Paragraph className="ams-mb--sm">{t('description')}</Paragraph>

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
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
