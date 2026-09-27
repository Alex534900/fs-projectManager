const tseslint = require("typescript-eslint");
const globals = require("globals");

module.exports = tseslint.config(
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      "prisma/**",
      "src/**/*.js",
      "src/**/*.js.map",
      "**/*.d.ts",
      "prisma.config.*"
    ]
  },

  ...tseslint.configs.recommended,

  {
    files: ["src/**/*.ts"],

    languageOptions: {
      globals: globals.node
    },

    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "prefer-const": "warn"
    }
  }
);