import type { StandaloneLinkProps } from '@amsterdam/design-system-react'

import { ChevronBackwardIcon } from '@amsterdam/design-system-react-icons'
import { clsx } from 'clsx'
import NextLink from 'next/link'

import { StandaloneLink } from '@meldingen/ui'

import styles from './BackLink.module.css'

export const BackLink = ({ className, ...restProps }: StandaloneLinkProps) => (
  <StandaloneLink
    {...restProps}
    className={clsx(styles.link, className)}
    icon={<ChevronBackwardIcon />}
    linkComponent={NextLink}
  />
)
