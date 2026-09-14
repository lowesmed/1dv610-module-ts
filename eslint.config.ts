import type { Linter } from 'eslint'
import config from '@lnu/eslint-config'
import { tsRules } from '@lnu/eslint-config/ts'
import prettier from 'eslint-config-prettier'

const eslintConfig: Linter.Config[] = [
  ...config,
  ...tsRules,
  {
    name: 'ts-cli-template/ts-jsdoc-overrides',
    files: ['**/*.ts'],
    rules: {
      // TypeScript's own type annotations already enforce these; redundant
      // JSDoc types would just drift out of sync with the real types over time.
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
    },
  },
  prettier,
]

export default eslintConfig
