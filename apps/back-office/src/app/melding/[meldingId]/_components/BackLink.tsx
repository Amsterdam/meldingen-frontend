import type { AnchorHTMLAttributes } from 'react'

import { ChevronBackwardIcon } from '@amsterdam/design-system-react-icons'
import { clsx } from 'clsx'
import NextLink from 'next/link'

import { Icon } from '@meldingen/ui'

import styles from './BackLink.module.css'

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'color'> & {
  href: string
}

export const BackLink = ({ children, className, href, ...restProps }: Props) => (
  /*
   * Apply Amsterdam Design System Standalone Link styling to NextLink.
   * Using a className avoids issues caused by the `legacyBehavior` prop.
   */
  <NextLink
    className={clsx('ams-standalone-link', 'ams-standalone-link--with-icon', styles.link, className)}
    href={href}
    {...restProps}
  >
    <Icon svg={<ChevronBackwardIcon />} />
    {children}
  </NextLink>
)
