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
  Select,
  TextArea,
} from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import Form from 'next/form'
import { useActionState, useEffect, useRef, useState } from 'react'

import type { SourceOutput, StaticFormTextAreaComponentOutput } from '@meldingen/api-client'

import { getAriaDescribedBy } from '@meldingen/form-renderer'
import { MarkdownToHtml } from '@meldingen/markdown-to-html'
import { Column } from '@meldingen/ui'

import type { FormState } from './actions'

import { InvalidFormAlert } from './_components/InvalidFormAlert'
import { SystemErrorAlert } from './_components/SystemErrorAlert'
import { postMeldingForm } from './actions'
import { MeldingData } from './types'
import { URGENCY_VALUES } from '~/constants'

import styles from './MeldingForm.module.css'

type Props = {
  defaultValues?: { primary?: string; source?: string; urgency?: number }
  existingId?: number
  existingMelding?: MeldingData
  existingToken?: string
  primaryTextArea: StaticFormTextAreaComponentOutput
  sources: SourceOutput[]
}

const initialState: FormState = {}

export const MeldingForm = ({
  defaultValues,
  existingId,
  existingMelding,
  existingToken,
  primaryTextArea,
  sources,
}: Props) => {
  const invalidFormAlertRef = useRef<HTMLDivElement>(null)
  const systemErrorAlertRef = useRef<HTMLDivElement>(null)

  const { description, label, maxCharCount } = primaryTextArea

  const ref = useRef<HTMLTextAreaElement>(null)

  const [{ formData, systemError, validationErrors }, formAction] = useActionState(action, initialState)
  const [, startTransition] = useTransition()
  const [prefetchedMelding, setPrefetchedMelding] = useState<MeldingData | null>(existingMelding ?? null)

  // Form components can be prefilled on load on the server, where we fill in existing answers from the backend,
  // or in case of an error, where we use the form data provided.
  // If there is form data, it should take priority over the prefilled components from the server.
  const primaryTextAreaDefaultValue = (formData?.get('primary') as string | null) ?? defaultValues?.primary ?? ''
  const sourceDefaultValue = (formData?.get('source') as string | null) ?? defaultValues?.source ?? ''
  const urgencyDefaultValue = (formData?.get('urgency') as string | null) ?? defaultValues?.urgency ?? 0

  const [charCount, setCharCount] = useState(primaryTextAreaDefaultValue.length)

  const t = useTranslations('melding-form')
  const tShared = useTranslations('shared')

  // Set focus on InvalidFormAlert when there are validation errors
  // and on SystemErrorAlert when there is a system error
  useEffect(() => {
    if (validationErrors && invalidFormAlertRef.current) {
      invalidFormAlertRef.current.focus()
    } else if (systemError && systemErrorAlertRef.current) {
      systemErrorAlertRef.current.focus()
    }
  }, [validationErrors, systemError])

  useEffect(() => {
    if (systemError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(systemError)
    }
  }, [systemError])

  const handleBlur = ({ target: { value: text } }: FocusEvent<HTMLTextAreaElement>) => {
    if (!text || text === lastSubmittedTextRef.current) return

    startTransition(async () => {
      try {
        const id = prefetchedMelding?.id ?? existingId
        const token = prefetchedMelding?.token ?? existingToken

        const { data, error } =
          id && token
            ? await patchMeldingByMeldingIdMelder({
                body: { text },
                path: { melding_id: id },
                query: { token },
              })
            : await postMelding({ body: { text } })

        if (error) throw error

        setPrefetchedMelding({
          classificationId: data.classification?.id,
          classificationName: data.classification?.name,
          createdAt: data.created_at,
          id: data.id,
          publicId: data.public_id,
          token: data.token,
        })

        lastSubmittedTextRef.current = text
      } catch (error) {
        // TODO: Log the error to an error reporting service
        // eslint-disable-next-line no-console
        console.error(error)
      }
    })
  }

  const hasPrimaryError = validationErrors?.some((error) => error.key === 'primary')
  const hasSourceError = validationErrors?.some((error) => error.key === 'source')

  return (
    <Grid as="main" className={`ams-page__area--body ${styles.main}`} gapVertical="large" paddingVertical="x-large">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }}>
        {Boolean(systemError) && <SystemErrorAlert ref={systemErrorAlertRef} />}
        {validationErrors && <InvalidFormAlert ref={invalidFormAlertRef} validationErrors={validationErrors} />}
        <Heading className="ams-mb-m" level={1}>
          {t('title')}
        </Heading>
        <Form action={formAction} noValidate>
          <Column>
            <Field invalid={hasPrimaryError}>
              <Label htmlFor="primary">{label}</Label>
              {description && (
                <MarkdownToHtml id="primary-description" type="description">
                  {description}
                </MarkdownToHtml>
              )}
              {hasPrimaryError && (
                <ErrorMessage id="primary-error">
                  {validationErrors?.find((error) => error.key === 'primary')?.message}
                </ErrorMessage>
              )}
              <TextArea
                aria-describedby={getAriaDescribedBy(
                  'primary',
                  description,
                  validationErrors?.find((error) => error.key === 'primary')?.message,
                )}
                aria-required="true"
                defaultValue={primaryTextAreaDefaultValue}
                id="primary"
                invalid={hasPrimaryError}
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
            {prefetchedMelding?.classificationName && (
              <Paragraph>De categorie van de melding is: {prefetchedMelding.classificationName}</Paragraph>
            )}
            {prefetchedMelding && (
              <input name="prefetchedMelding" type="hidden" value={JSON.stringify(prefetchedMelding)} />
            )}
            <Field invalid={hasSourceError}>
              <Label htmlFor="source">{t('source-label')}</Label>
              {hasSourceError && (
                <ErrorMessage id="source-error">
                  {validationErrors?.find((error) => error.key === 'source')?.message}
                </ErrorMessage>
              )}
              <Select
                aria-describedby={getAriaDescribedBy(
                  'source',
                  undefined,
                  validationErrors?.find((error) => error.key === 'source')?.message,
                )}
                defaultValue={sourceDefaultValue}
                id="source"
                invalid={hasSourceError}
                // React doesn't update the defaultValue of a select element after the initial render,
                // so we use the key prop to force a remount of the select element when sourceDefaultValue changes
                key={sourceDefaultValue}
                name="source"
              >
                <Select.Option value="">{t('source-default')}</Select.Option>
                {sources.map((source) => (
                  <Select.Option key={source.id} value={String(source.id)}>
                    {source.name}
                  </Select.Option>
                ))}
              </Select>
            </Field>
            <FieldSet aria-required="true" legend={t('urgency-label')} role="radiogroup">
              <Column gap="x-small">
                {URGENCY_VALUES.map((urgency) => (
                  <Radio
                    aria-required="true"
                    defaultChecked={urgency === Number(urgencyDefaultValue)}
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
