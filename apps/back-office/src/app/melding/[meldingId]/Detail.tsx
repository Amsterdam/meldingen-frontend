'use client'

import { DescriptionList, Field, Grid, Label, Select } from '@amsterdam/design-system-react'
import { ChangeEvent, Fragment } from 'react'

import { changeStateToComplete, changeStateToProcess } from './actions'

const getDefaultValue = (meldingState: string) => {
  if (meldingState === 'processing') {
    return 'process'
  }
  if (meldingState === 'completed') {
    return 'complete'
  }
  return undefined
}

type Props = {
  meldingData: { key: string; label: string; value: string }[]
  meldingId: number
  meldingState: string
}

export const Detail = ({ meldingData, meldingId, meldingState }: Props) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target

    if (value === 'process') {
      changeStateToProcess(meldingId)
    }
    if (value === 'complete') {
      changeStateToComplete(meldingId)
    }
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <DescriptionList className="ams-mb-l">
          {meldingData.map((item) => (
            <Fragment key={item.key}>
              <DescriptionList.Term>{item.label}</DescriptionList.Term>
              <DescriptionList.Description>{item.value}</DescriptionList.Description>
            </Fragment>
          ))}
        </DescriptionList>
        <form>
          <Field>
            <Label htmlFor="status">Status</Label>
            <Select defaultValue={getDefaultValue(meldingState)} id="status" name="status" onChange={handleChange}>
              <Select.Option value="">Kies een status</Select.Option>
              <Select.Option value="process">In behandeling</Select.Option>
              <Select.Option value="complete">Afgehandeld</Select.Option>
            </Select>
          </Field>
        </form>
      </Grid.Cell>
    </Grid>
  )
}
