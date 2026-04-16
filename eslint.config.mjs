import { defineConfig } from "eslint/config"
import eslint from "@eslint/js"
import prettier from "eslint-config-prettier"
import tseslint from "typescript-eslint"
import vitest from "@vitest/eslint-plugin"

export default defineConfig([
  { ignores: ["dist/**", "coverage/**"] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["tests/**"],
    plugins: { vitest },
    rules: vitest.configs.recommended.rules,
  },
  {
    languageOptions: {
      parserOptions: {
        project: "tsconfig.lint.json",
      },
    },
  },
  prettier,
])
