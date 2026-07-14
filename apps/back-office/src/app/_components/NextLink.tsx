import type { ComponentType } from 'react'
import type { AnchorHTMLAttributes } from 'react'

import Link from 'next/link'

// There is a type mismatch between the NextLink component and Amsterdam Design System links.
// This typecast is safe as long as we pass an href to the component we use it on.
export const NextLink = Link as unknown as ComponentType<AnchorHTMLAttributes<HTMLAnchorElement>>
