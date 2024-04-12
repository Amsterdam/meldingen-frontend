import { signOut } from 'next-auth/react'
import { AppBar } from 'react-admin'

export const CustomAppBar = () => (
  <AppBar color="primary" position="sticky">
    <button type="button" style={{ marginLeft: 'auto' }} onClick={() => signOut()}>
      Uitloggen
    </button>
  </AppBar>
)
