import { Layout } from 'react-admin'
import type { LayoutProps } from 'react-admin'

import { CustomAppBar } from './CustomAppBar'

export const CustomLayout = (props: LayoutProps) => <Layout {...props} appBar={CustomAppBar} />
