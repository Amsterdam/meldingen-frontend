export const COOKIES = {
  ADDRESS: 'meldingen_address',
  ID: 'meldingen_id',
  LAST_PANEL_PATH: 'meldingen_last_panel_path',
  SOURCE: 'meldingen_source',
  TOKEN: 'meldingen_token',
} as const

// Do not add `maxAge` or `expires` here.
// Session cookies should be deleted when the browser closes.
export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
} as const

export const TOP_ANCHOR_ID = 'top'

export const ASSET_FALLBACK_SRC = '/asset-fallback.svg'
