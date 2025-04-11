'use client'

import { Grid, Heading, Paragraph } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { useActionState } from 'react'

import { SubmitButton, SummaryList } from '@meldingen/ui'

import { postSummaryForm } from './actions'
import { GenericSummaryData } from './getSummaryData'
import { BackLink } from '../_components/BackLink'

export type Props = {
  melding: GenericSummaryData
  additionalQuestionsAnswers: GenericSummaryData[]
  location: GenericSummaryData
  contact?: GenericSummaryData
}

const initialState: { message?: string } = {}

export const Summary = ({ melding, additionalQuestionsAnswers, location, contact }: Props) => {
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
          {
            <SummaryList.Item key={melding.key}>
              <SummaryList.Term>{melding.term}</SummaryList.Term>
              {melding.description.map((item) => (
                <SummaryList.Description key={item}>{item}</SummaryList.Description>
              ))}
            </SummaryList.Item>
          }

          {additionalQuestionsAnswers.length > 0 &&
            additionalQuestionsAnswers.map(({ key, term, description }) => (
              <SummaryList.Item key={key}>
                <SummaryList.Term>{term}</SummaryList.Term>
                {description.map((item) => (
                  <SummaryList.Description key={item}>{item}</SummaryList.Description>
                ))}
              </SummaryList.Item>
            ))}

          {
            <SummaryList.Item key={location.key}>
              <SummaryList.Term>{location.term}</SummaryList.Term>
              {location.description.map((item) => (
                <SummaryList.Description key={item}>{item}</SummaryList.Description>
              ))}
            </SummaryList.Item>
          }

          {contact && (
            <SummaryList.Item key={contact.key}>
              <SummaryList.Term>{contact.term}</SummaryList.Term>
              {contact.description.map((item) => (
                <SummaryList.Description key={item}>{item}</SummaryList.Description>
              ))}
            </SummaryList.Item>
          )}
        </SummaryList>

        <form action={formAction}>
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
