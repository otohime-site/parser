export default {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  modulePathIgnorePatterns: ["dist"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
}
