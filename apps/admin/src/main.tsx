import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'

import { Admin } from './app/Admin'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <Admin />
  </StrictMode>,
)
