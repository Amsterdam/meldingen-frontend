'use client'

import { DescriptionList, Field, Grid, Label, Paragraph, Select } from '@amsterdam/design-system-react'
import { useTranslations } from 'next-intl'
import { ChangeEvent, Fragment, startTransition, useActionState } from 'react'

import { changeMeldingState } from './actions'

type Props = {
  meldingData: { key: string; term: string; description: string }[]
  meldingId: number
  meldingState: string
}

const initialState: { message?: string } = {}

export const Detail = ({ meldingData, meldingId, meldingState }: Props) => {
  const [changeStateError, changeStateAction] = useActionState(changeMeldingState, initialState)

  const t = useTranslations('detail.state')

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target

    if (value === 'processing' || value === 'completed') {
      startTransition(() => {
        changeStateAction({
          id: meldingId,
          state: value,
        })
      })
    }
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <DescriptionList className="ams-mb-l">
          {meldingData.map(({ key, term, description }) => (
            <Fragment key={key}>
              <DescriptionList.Term>{term}</DescriptionList.Term>
              <DescriptionList.Description>{description}</DescriptionList.Description>
            </Fragment>
          ))}
        </DescriptionList>
        {changeStateError?.message && <Paragraph>{changeStateError.message}</Paragraph>}
        <form>
          <Field>
            <Label htmlFor="state">{t('label')}</Label>
            <Select defaultValue={meldingState || undefined} id="state" name="state" onChange={handleChange}>
              <Select.Option value="">{t('options.default')}</Select.Option>
              <Select.Option value="processing">{t('options.processing')}</Select.Option>
              <Select.Option value="completed">{t('options.completed')}</Select.Option>
            </Select>
          </Field>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
