import { ChevronBackwardIcon } from '@amsterdam/design-system-react-icons'
import NextLink from 'next/link'
import type { AnchorHTMLAttributes } from 'react'

import { StandaloneLink } from '@meldingen/ui'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> & {
  href: string
}

export const BackLink = ({ href, ...restProps }: Props) => (
  <NextLink href={href} legacyBehavior passHref>
    <StandaloneLink {...restProps} icon={ChevronBackwardIcon} />
  </NextLink>
)
