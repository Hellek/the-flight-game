import { relative } from 'path'

const buildEslintCommand = filenames =>
  `eslint --fix --max-warnings=0 ${filenames
    .map(f => relative(process.cwd(), f))
    .join(' ')}`

const stylelintCommand = filenames =>
  `stylelint --fix --allow-empty-input ${filenames
    .map(f => relative(process.cwd(), f))
    .join(' ')}`

const typeCheckCommand = () => 'npm run check-types'

const testCommand = () => 'npm run test:run'

const config = {
  '*.{js,jsx}': [buildEslintCommand],
  '*.{ts,tsx}': [buildEslintCommand, typeCheckCommand, testCommand],
  '*.css': [stylelintCommand],
}

export default config
