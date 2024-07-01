'use client'

import { Button, Icon } from '@amsterdam/design-system-react'
import { ChevronLeftIcon } from '@amsterdam/design-system-react-icons'
import dynamic from 'next/dynamic'
import { useRef, useState } from 'react'

import { Grid } from '@meldingen/ui'

import mockData from '../mocks/wizard-test.json'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const Home = () => {
  const [page, setPage] = useState<number>(0)

  const formInstance = useRef<any>(null)

  const handleClick = () => {
    if (formInstance.current) {
      formInstance.current.setPage(page - 1)
      setPage(page - 1)
    }
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        {page > 0 && (
          // TODO: i18n
          <Button className="ams-mb--xs" onClick={handleClick} variant="tertiary">
            <Icon size="level-5" svg={ChevronLeftIcon} />
            Vorige vraag
          </Button>
        )}
        <FormRenderer
          form={mockData}
          formReady={(instance: any) => {
            setPage(instance.page)
            formInstance.current = instance
          }}
          onNextPage={(instance: any) => setPage(instance.page)}
        />
      </Grid.Cell>
    </Grid>
  )
}

export default Home
