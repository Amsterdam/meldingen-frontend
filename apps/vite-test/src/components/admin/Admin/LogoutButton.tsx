import ExitIcon from '@mui/icons-material/PowerSettingsNew'
import { MenuItem } from '@mui/material'
// import { signOut } from 'next-auth/react'
import { forwardRef } from 'react'
import type { Ref } from 'react'

export const LogoutButton = forwardRef((props, ref: Ref<HTMLAnchorElement>) => (
  <MenuItem href="#" onClick={() => console.log('logout')} ref={ref} {...props}>
    <ExitIcon /> Uitloggen
  </MenuItem>
))
