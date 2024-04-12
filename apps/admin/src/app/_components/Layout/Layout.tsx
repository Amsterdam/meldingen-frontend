import { Layout } from 'react-admin'
import type { LayoutProps } from 'react-admin'

import { AppBar } from '../AppBar'

export const CustomLayout = (props: LayoutProps) => <Layout {...props} appBar={AppBar} />
