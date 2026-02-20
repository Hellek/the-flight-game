/** @type {import('stylelint').Config} */
export default {
  ignores: ['dist/**', '**/*.min.css'],
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'layer', 'apply', 'config', 'import', 'theme'],
      },
    ],
    'import-notation': 'string',
  },
}
