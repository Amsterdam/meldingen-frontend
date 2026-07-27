import type { StandaloneLinkProps } from '@amsterdam/design-system-react'

import { ChevronBackwardIcon } from '@amsterdam/design-system-react-icons'
import NextLink from 'next/link'

import { StandaloneLink } from '@meldingen/ui'

export const BackLink = (props: StandaloneLinkProps) => (
  <StandaloneLink {...props} icon={ChevronBackwardIcon} linkComponent={NextLink} />
)
