'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import { Grid } from '@meldingen/ui'

const mockCategoryId = '1'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const AanvullendeVragen = () => {
  const [data, setData] = useState(null)

  const result = async () => {
    try {
      await fetch(`http://localhost:8000/form/classification/${mockCategoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((res) => setData(res))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (!data) result()

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <FormRenderer form={data} />
      </Grid.Cell>
    </Grid>
  )
}

export default AanvullendeVragen
