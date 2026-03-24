import NextLink from 'next/link'
import { AnchorHTMLAttributes, PropsWithChildren } from 'react'

export const LinkComponent = (props: PropsWithChildren<AnchorHTMLAttributes<HTMLAnchorElement>>) => (
  <NextLink href="/" {...props} />
)
