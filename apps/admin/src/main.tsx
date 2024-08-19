import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'

import Admin from './app'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <StrictMode>
    <Admin />
  </StrictMode>,
)
