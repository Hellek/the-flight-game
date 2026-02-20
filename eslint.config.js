import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@stylistic': stylistic,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      // React rules
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, extraHOCs: ['observer'] },
      ],

      // Import sorting
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            [
              '^\\u0000',
              '^.+\\.css$', // Style imports
              '^react',
              '(\\w-/)*', // Other packages
              '^@',
              '^\\.', // Relative
            ],
          ],
        },
      ],

      // Unused imports and variables
      // https://www.npmjs.com/package/eslint-plugin-unused-imports
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // General code style
      'no-plusplus': ['warn', { allowForLoopAfterthoughts: true }],

      // Stylistic rules - Quotes
      '@stylistic/quotes': ['warn', 'single'],
      '@stylistic/quote-props': ['warn', 'as-needed'],
      '@stylistic/jsx-quotes': ['warn', 'prefer-double'],

      // Stylistic rules - Indentation
      '@stylistic/indent': [
        'warn',
        2,
        {
          SwitchCase: 1,
          MemberExpression: 1,
        },
      ],
      '@stylistic/indent-binary-ops': ['warn', 2],

      // Stylistic rules - Line length and semicolons
      '@stylistic/max-len': [
        'warn',
        {
          code: 120,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      '@stylistic/semi': ['warn', 'never'],

      // Stylistic rules - Commas
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],
      '@stylistic/comma-spacing': 'warn',

      // Stylistic rules - Spacing
      '@stylistic/no-multi-spaces': 'warn',
      '@stylistic/key-spacing': ['warn', { beforeColon: false, afterColon: true }],
      '@stylistic/array-bracket-spacing': 'warn',
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/space-before-blocks': 'warn',
      '@stylistic/padded-blocks': ['warn', 'never'],

      // Stylistic rules - Brackets and parentheses
      '@stylistic/arrow-parens': ['warn', 'as-needed'],
      '@stylistic/object-curly-newline': ['warn', { multiline: true, consistent: true }],

      // Stylistic rules - Empty lines
      '@stylistic/no-multiple-empty-lines': ['warn', { max: 1, maxBOF: 0 }],
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
        { blankLine: 'any', prev: '*', next: ['if', 'for', 'return'] },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        {
          blankLine: 'always',
          prev: '*',
          next: ['throw', 'try', 'while', 'do', 'switch', 'function', 'multiline-const'],
        },
        { blankLine: 'always', prev: 'multiline-const', next: '*' },
      ],

      // Stylistic rules - Function formatting
      '@stylistic/function-call-argument-newline': ['warn', 'consistent'],
      '@stylistic/function-paren-newline': ['error', 'multiline-arguments'],

      // Stylistic rules - Class members
      '@stylistic/lines-between-class-members': [
        'warn',
        {
          enforce: [
            { blankLine: 'always', prev: 'method', next: 'field' },
            { blankLine: 'always', prev: 'field', next: 'method' },
            { blankLine: 'always', prev: 'method', next: 'method' },
            { blankLine: 'never', prev: 'field', next: 'field' },
          ],
        },
      ],
    },
  },
)
