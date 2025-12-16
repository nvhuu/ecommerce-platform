import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import turboPlugin from "eslint-plugin-turbo";
import globals from "globals";
import tseslint from "typescript-eslint";

/**
 * A shared ESLint configuration for NestJS/Node.js applications.
 * Includes strict TypeScript rules for type safety and clean architecture.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const nestjsConfig = [
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: "commonjs",
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    rules: {
      // Strict TypeScript rules for type safety
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-enum-comparison": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/require-await": "off", // Framework may require async
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  {
    ignores: ["dist/**", "node_modules/**", "eslint.config.mjs"],
  },
];
