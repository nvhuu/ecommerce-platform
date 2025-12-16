// @ts-check
import { nestjsConfig } from '@repo/eslint-config/nestjs';

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.prisma/**',
      '**/dist/**',
      '**/build/**',
      '**/*.d.ts',
    ],
  },
  ...nestjsConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
