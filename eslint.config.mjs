// @ts-check

import eslint from "@eslint/js"
import prettier from "eslint-config-prettier"
import tseslint from "typescript-eslint"
import jest from "eslint-plugin-jest"

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["test/**"],
    ...jest.configs["flat/recommended"],
  },
  {
    languageOptions: {
      parserOptions: {
        project: "tsconfig.lint.json",
      },
    },
  },
  prettier,
)
