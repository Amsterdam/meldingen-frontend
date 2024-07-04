/* eslint-disable jsx-a11y/anchor-is-valid */

'use client'

import { Link } from '@amsterdam/design-system-react'
import dynamic from 'next/dynamic'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { Grid } from '@meldingen/ui'

import mockData from '../../mocks/wizard-test.json'

const FormRenderer = dynamic(() => import('@meldingen/formio').then((mod) => mod.FormRenderer), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

const AanvullendeVragen = () => {
  const [page, setPage] = useState<number>(0)

  const formInstance = useRef<any>(null)

  const router = useRouter()

  const handleClick = () => {
    if (formInstance.current) {
      formInstance.current.setPage(page - 1)
      setPage(page - 1)
    }
  }

  const handleSubmit = () => {
    router.push('/bedankt')
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        {/* TODO: i18n */}
        {page === 0 ? (
          <NextLink href="/" legacyBehavior passHref>
            <Link className="ams-mb--xs">Vorige vraag</Link>
          </NextLink>
        ) : (
          <Link href="#" className="ams-mb--xs" onClick={handleClick}>
            Vorige vraag
          </Link>
        )}
        <FormRenderer
          form={mockData}
          formReady={(instance: any) => {
            setPage(instance.page)
            formInstance.current = instance
          }}
          onNextPage={(instance: any) => setPage(instance.page)}
          onSubmit={handleSubmit}
          options={{
            language: 'nl',
            i18n: {
              nl: {
                next: 'Volgende vraag',
                submit: 'Volgende vraag',
              },
            },
          }}
        />
      </Grid.Cell>
    </Grid>
  )
}

export default AanvullendeVragen
