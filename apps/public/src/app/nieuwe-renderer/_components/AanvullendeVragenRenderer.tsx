'use client'

import { Grid, Heading, Link } from '@amsterdam/design-system-react'
import { FormRenderer } from '@meldingen/form-renderer'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import type { FormEvent } from 'react'

// TODO: fix formData type
type Props = {
  formData: any[]
  nextPanelPath: string
  previousPanelPath: string
}

export const AanvullendeVragenRenderer = ({ formData, nextPanelPath, previousPanelPath }: Props) => {
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    router.push(nextPanelPath)
  }

  return (
    <Grid paddingBottom="large" paddingTop="medium">
      <Grid.Cell span={{ narrow: 4, medium: 6, wide: 7 }} start={{ narrow: 1, medium: 2, wide: 2 }}>
        <NextLink href={previousPanelPath} legacyBehavior passHref>
          <Link className="ams-mb--xs" href={previousPanelPath}>
            Vorige vraag
          </Link>
        </NextLink>
        <Heading>Beschrijf uw melding</Heading>
        <FormRenderer formData={formData} onSubmit={handleSubmit} />
      </Grid.Cell>
    </Grid>
  )
}
