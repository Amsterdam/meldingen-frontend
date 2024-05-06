import { AppBar, TitlePortal } from 'react-admin'

import { LogoutButton } from './LogoutButton'

export const CustomAppBar = () => (
  <AppBar>
    <TitlePortal />
    <LogoutButton />
  </AppBar>
)
