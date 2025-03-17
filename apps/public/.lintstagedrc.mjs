const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --file ')}`

export default {
  '*.{css,scss}': ['stylelint --allow-empty-input', 'prettier --check'],
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, 'prettier --check', 'tsc-files --noEmit'],
}
