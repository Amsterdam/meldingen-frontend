import type { AnchorHTMLAttributes } from 'react'

import { ChevronBackwardIcon } from '@amsterdam/design-system-react-icons'
import { clsx } from 'clsx'
import NextLink from 'next/link'

import { StandaloneLink } from '@meldingen/ui'

import styles from './BackLink.module.css'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> & {
  href: string
}

export const BackLink = ({ className, href, ...restProps }: Props) => (
  <NextLink href={href} legacyBehavior passHref>
    <StandaloneLink {...restProps} className={clsx(styles.link, className)} icon={<ChevronBackwardIcon />} />
  </NextLink>
)
