import ExitIcon from '@mui/icons-material/PowerSettingsNew'
import { MenuItem } from '@mui/material'
import { forwardRef } from 'react'
import type { Ref } from 'react'
import { useTranslate } from 'react-admin'

export const LogoutButton = forwardRef((props, ref: Ref<HTMLAnchorElement>) => {
  const translate = useTranslate()
  return (
    <MenuItem href="#" onClick={() => console.log('signOut§')} ref={ref} {...props}>
      <ExitIcon /> {translate('ra.auth.logout')}
    </MenuItem>
  )
})
