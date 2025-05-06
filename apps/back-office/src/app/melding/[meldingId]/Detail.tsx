'use client'

import { DescriptionList, Grid } from '@amsterdam/design-system-react'
import { Fragment } from 'react'

type Props = {
  meldingData: { key: string; term: string; description: string }[]
}

export const Detail = ({ meldingData }: Props) => {
  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 6 }} start={{ narrow: 1, medium: 2, wide: 3 }}>
        <DescriptionList>
          {meldingData.map(({ key, term, description }) => (
            <Fragment key={key}>
              <DescriptionList.Term>{term}</DescriptionList.Term>
              <DescriptionList.Description>{description}</DescriptionList.Description>
            </Fragment>
          ))}
        </DescriptionList>
      </Grid.Cell>
    </Grid>
  )
}
