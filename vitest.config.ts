import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "jsdom",
    exclude: ["dist/**", "node_modules/**"],
    typecheck: {
      enabled: true,
      include: ["tests/**/*.test.ts"],
      tsconfig: "tsconfig.lint.json",
    },
  },
})
