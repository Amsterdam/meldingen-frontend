/// <reference types="@testing-library/jest-dom" />

import '@testing-library/jest-dom/vitest'

// 2026-09-10
// Mock `window.matchMedia` to prevent errors in tests due to the `@formio/js` and `inputmask` mismatch.
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(() => ({
    addEventListener: vi.fn(),
    matches: false,
    removeEventListener: vi.fn(),
  })),
})
