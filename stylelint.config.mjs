import { fileURLToPath } from 'node:url'

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules'],
  plugins: ['stylelint-order', 'stylelint-value-no-unknown-custom-properties'],
  rules: {
    'csstools/value-no-unknown-custom-properties': [
      true,
      {
        importFrom: [
          fileURLToPath(new URL('node_modules/@amsterdam/design-system-tokens/dist/index.css', import.meta.url)),
        ],
      },
    ],
    'media-feature-range-notation': 'prefix',
    'order/order': ['custom-properties', 'declarations'],
    'order/properties-order': [
      ['composes'],
      {
        unspecified: 'bottomAlphabetical',
      },
    ],
    'property-disallowed-list': [
      [
        'margin',
        'margin-bottom',
        'margin-left',
        'margin-right',
        'margin-top',
        'padding',
        'padding-bottom',
        'padding-left',
        'padding-right',
        'padding-top',
      ],
    ],
    'selector-class-pattern': null,
    'unit-disallowed-list': ['px'],
  },
}
