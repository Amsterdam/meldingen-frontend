import { AppBar, UserMenu } from 'react-admin'

import { LogoutButton } from './LogoutButton'

export const CustomAppBar = () => (
  <AppBar>
    <UserMenu>
      <LogoutButton />
    </UserMenu>
  </AppBar>
)
