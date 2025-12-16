// @ts-check
import { nestjsConfig } from '@repo/eslint-config/nestjs';

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nestjsConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
