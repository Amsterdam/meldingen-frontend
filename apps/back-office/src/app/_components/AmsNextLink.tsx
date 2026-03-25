import { IconProps } from '@amsterdam/design-system-react'
import { clsx } from 'clsx'
import NextLink from 'next/link'
import { AnchorHTMLAttributes } from 'react'

import { Icon } from '@meldingen/ui'

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  icon?: IconProps['svg']
  variant?: 'link' | 'standalone-link-with-icon' | 'menu-link'
}

/*
 * Use classNames to apply Amsterdam Design System link styling to NextLink.
 * Using a className avoids issues caused by the `legacyBehavior` prop.
 */
const getClassNames = (variant: Props['variant']) => {
  switch (variant) {
    case 'menu-link':
      return 'ams-menu__link'
    case 'standalone-link-with-icon':
      return 'ams-standalone-link ams-standalone-link--with-icon'
    case 'link':
    default:
      return 'ams-link'
  }
}

export const AmsNextLink = ({ children, className, href, icon, variant, ...restProps }: Props) => (
  <NextLink className={clsx(getClassNames(variant), className)} href={href} {...restProps}>
    {icon && <Icon className={variant === 'menu-link' ? 'ams-menu__icon' : undefined} svg={icon} />}
    {children}
  </NextLink>
)
