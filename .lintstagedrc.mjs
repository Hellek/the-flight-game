import { cwd } from 'node:process'
import { relative } from 'node:path'

const buildEslintCommand = filenames =>
  `eslint --fix --max-warnings=0 ${filenames
    .map(f => relative(cwd(), f))
    .join(' ')}`

const stylelintCommand = filenames =>
  `npm run lint:styles:fix -- ${filenames
    .map(f => relative(cwd(), f))
    .join(' ')}`

const typeCheckCommand = () => 'npm run check-types'

const testCommand = () => 'npm run test:run'

const config = {
  '*.{js,jsx}': [buildEslintCommand],
  '*.{ts,tsx}': [buildEslintCommand, typeCheckCommand, testCommand],
  '*.css': [stylelintCommand],
}

export default config
