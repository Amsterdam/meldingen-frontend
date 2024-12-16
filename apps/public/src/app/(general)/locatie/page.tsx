'use client'

import { Heading, Link, Paragraph } from '@amsterdam/design-system-react'
import { Grid, SubmitButton } from '@meldingen/ui'
import NextLink from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, type FormEvent } from 'react'

import { BackLink } from '../_components/BackLink'

const Form = () => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const meldingId = searchParams?.get('id')
  const token = searchParams?.get('token')
  // TODO: how do we want to handle missing token or id?
  // Redirect to root?

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    router.push(`/bijlage?token=${token}&id=${meldingId}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" />
      <SubmitButton>Volgende vraag</SubmitButton>
    </form>
  )
}

const Locatie = () => (
  <Grid paddingBottom="large" paddingTop="medium">
    <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
      {/* TODO: get href of last aanvullende vragen page */}
      <BackLink href="/">Vorige vraag</BackLink>
      <Heading className="ams-mb--sm">Locatie</Heading>

      {/* TODO: text should come from api */}
      <Heading level={2} size="level-4">
        Waar staat de container?
      </Heading>
      <Paragraph className="ams-mb--xs">
        In het volgende scherm kunt u op de kaart een adres of container opzoeken.
      </Paragraph>

      <NextLink href="/locatie/kies" legacyBehavior passHref>
        <Link variant="standalone" href="dummy-href" className="ams-mb--md">
          Selecteer de locatie
        </Link>
      </NextLink>
      <Suspense>
        <Form />
      </Suspense>
    </Grid.Cell>
  </Grid>
)

export default Locatie
