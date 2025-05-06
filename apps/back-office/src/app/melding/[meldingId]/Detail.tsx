'use client'

import { DescriptionList, Field, Grid, Label, Paragraph, Select } from '@amsterdam/design-system-react'
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
            <Label htmlFor="state">Status</Label>
            <Select defaultValue={meldingState || undefined} id="state" name="state" onChange={handleChange}>
              <Select.Option value="">Kies een status</Select.Option>
              <Select.Option value="processing">In behandeling</Select.Option>
              <Select.Option value="completed">Afgehandeld</Select.Option>
            </Select>
          </Field>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
