'use client'

import {
  Button,
  CharacterCount,
  ErrorMessage,
  Field,
  FieldSet,
  Grid,
  Heading,
  Label,
  Radio,
  TextArea,
} from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useRef, useState } from 'react'

import type { StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { getAriaDescribedBy } from '@meldingen/form-renderer'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Column } from '@meldingen/ui'

import type { FormState } from './actions'

import { URGENCY_VALUES } from '../../constants'
import { postMeldingForm } from './actions'

import styles from './MeldingForm.module.css'

type Props = {
  primaryTextArea: StaticFormTextAreaComponentOutput
}

const initialState: FormState = {}

export const MeldingForm = ({ primaryTextArea }: Props) => {
  const { description, label, maxCharCount } = primaryTextArea

  const ref = useRef<HTMLTextAreaElement>(null)
  const [charCount, setCharCount] = useState(ref.current?.value.length || 0)

  const [{ formData, validationErrors }, formAction] = useActionState(postMeldingForm, initialState)

  const t = useTranslations('melding-form')
  const tShared = useTranslations('shared')

  return (
    <Grid as="main" className={`ams-page__area--body ${styles.main}`} gapVertical="large" paddingVertical="x-large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }}>
        <Heading className="ams-mb-m" level={1}>
          {t('title')}
        </Heading>
        <Form action={formAction} noValidate>
          <Column>
            <Field>
              <Label htmlFor="primary">{label}</Label>
              {description && (
                <MarkdownToHtml id="primary-description" type="description">
                  {description}
                </MarkdownToHtml>
              )}
              {validationErrors && <ErrorMessage>{validationErrors[0].message}</ErrorMessage>}
              <TextArea
                aria-describedby={getAriaDescribedBy('primary', description)}
                aria-required="true"
                defaultValue={(formData?.get('primary') as string) ?? ''} // TODO: prefill
                id="primary"
                name="primary"
                onChange={() => {
                  if (typeof maxCharCount === 'number' && ref.current) {
                    setCharCount(ref.current.value.length)
                  }
                }}
                ref={ref}
                rows={4}
              />
              {maxCharCount && <CharacterCount length={charCount} maxLength={maxCharCount} />}
            </Field>
            <FieldSet aria-required="true" legend={t('urgency-label')} role="radiogroup">
              <Column gap="x-small">
                {URGENCY_VALUES.map((urgency, index) => (
                  <Radio
                    aria-required="true"
                    defaultChecked={urgency === 0}
                    id={index === 0 ? 'urgency' : undefined}
                    key={urgency}
                    name="urgency"
                    value={String(urgency)}
                  >
                    {tShared(`urgency.${urgency}`)}
                  </Radio>
                ))}
              </Column>
            </FieldSet>
            <Button className={styles.submit} type="submit">
              {t('submit-button')}
            </Button>
          </Column>
        </Form>
      </Grid.Cell>
    </Grid>
  )
}
