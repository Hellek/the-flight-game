import { relative } from 'path'

const buildEslintCommand = filenames =>
  `eslint --fix --max-warnings=0 ${filenames
    .map(f => relative(process.cwd(), f))
    .join(' ')}`

const config = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
}

export default config
