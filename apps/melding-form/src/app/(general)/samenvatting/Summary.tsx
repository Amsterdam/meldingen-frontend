'use client'

import { Heading, Paragraph } from '@amsterdam/design-system-react'
import Form from 'next/form'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { useActionState, useEffect } from 'react'

import { Link, SubmitButton, SummaryList, UnorderedList } from '@meldingen/ui'

import { AttachmentImage } from './_components/AttachmentImage'
import { postSummaryForm } from './actions'
import { BackLink } from '../_components/BackLink/BackLink'
import { FormHeader } from '../_components/FormHeader/FormHeader'
import { SystemErrorAlert } from '../_components/SystemErrorAlert/SystemErrorAlert'
import { FormState } from 'apps/melding-form/src/types'

type GenericSummaryData = {
  key: string
  term: string
  description: string
}

type File = {
  blob: Blob
  fileName: string
}

type Props = {
  additionalQuestions: (GenericSummaryData & { link: string })[]
  attachments: Omit<GenericSummaryData, 'description'> & { files: File[] }
  contact?: Omit<GenericSummaryData, 'description'> & { description: string[] }
  location: GenericSummaryData
  primaryForm: GenericSummaryData
}

const initialState: Pick<FormState, 'systemError'> = {}

export const Summary = ({ attachments, primaryForm, additionalQuestions, location, contact }: Props) => {
  const [{ systemError }, formAction] = useActionState(postSummaryForm, initialState)

  const t = useTranslations('summary')

  useEffect(() => {
    if (systemError) {
      // TODO: Log the error to an error reporting service
      // eslint-disable-next-line no-console
      console.error(systemError)
    }
  }, [systemError])

  return (
    <>
      <BackLink className="ams-mb-s" href="/contact">
        {t('back-link')}
      </BackLink>
      <main>
        {Boolean(systemError) && <SystemErrorAlert />}
        <FormHeader title={t('title')} step={t('step')} />
        <Heading level={1} size="level-3" className="ams-mb-s">
          {t('main-title')}
        </Heading>
        <Paragraph className="ams-mb-m">{t('description')}</Paragraph>
        <SummaryList className="ams-mb-m">
          <SummaryList.Item>
            <SummaryList.Term>{primaryForm.term}</SummaryList.Term>
            <SummaryList.Description>{primaryForm.description}</SummaryList.Description>
            <SummaryList.Description>
              <NextLink href="/" legacyBehavior passHref>
                <Link>{t('change-links.primary')}</Link>
              </NextLink>
            </SummaryList.Description>
          </SummaryList.Item>

          {additionalQuestions.length > 0 &&
            additionalQuestions.map(({ key, term, description, link }) => (
              <SummaryList.Item key={key}>
                <SummaryList.Term>{term}</SummaryList.Term>
                <SummaryList.Description>{description}</SummaryList.Description>
                <SummaryList.Description>
                  <NextLink href={link} legacyBehavior passHref>
                    <Link>{t('change-links.additional')}</Link>
                  </NextLink>
                </SummaryList.Description>
              </SummaryList.Item>
            ))}

          <SummaryList.Item>
            <SummaryList.Term>{location.term}</SummaryList.Term>
            <SummaryList.Description>{location.description}</SummaryList.Description>
            <SummaryList.Description>
              <NextLink href="/locatie" legacyBehavior passHref>
                <Link>{t('change-links.location')}</Link>
              </NextLink>
            </SummaryList.Description>
          </SummaryList.Item>

          {attachments.files.length > 0 && (
            <SummaryList.Item>
              <SummaryList.Term>{attachments.term}</SummaryList.Term>
              <SummaryList.Description>
                <UnorderedList markers={false} className="ams-gap-m">
                  {attachments.files.map(({ fileName, blob }) => (
                    <UnorderedList.Item key={fileName}>
                      <AttachmentImage blob={blob} fileName={fileName} />
                    </UnorderedList.Item>
                  ))}
                </UnorderedList>
              </SummaryList.Description>
              <SummaryList.Description>
                <NextLink href="/bijlage" legacyBehavior passHref>
                  <Link>{t('change-links.attachments')}</Link>
                </NextLink>
              </SummaryList.Description>
            </SummaryList.Item>
          )}

          {contact && (
            <SummaryList.Item>
              <SummaryList.Term>{contact.term}</SummaryList.Term>
              {contact.description.map((item) => (
                <SummaryList.Description key={item}>{item}</SummaryList.Description>
              ))}
              <SummaryList.Description>
                <NextLink href="/contact" legacyBehavior passHref>
                  <Link>{t('change-links.contact')}</Link>
                </NextLink>
              </SummaryList.Description>
            </SummaryList.Item>
          )}
        </SummaryList>

        <Form action={formAction} noValidate>
          <SubmitButton>{t('submit-button')}</SubmitButton>
        </Form>
      </main>
    </>
  )
}
