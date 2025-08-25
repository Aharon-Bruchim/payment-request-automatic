// eslint.config.js
import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import promise from 'eslint-plugin-promise';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended, 
  ts.configs['recommended-type-checked'], 
  ts.configs['stylistic-type-checked'], 
  react.configs.recommended, 
  reactHooks.configs.recommended, 
  importPlugin.configs.recommended, 
  promise.configs.recommended,
  {
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      react: react,
      'react-hooks': reactHooks,
      import: importPlugin,
      promise: promise,
      prettier: prettier,
    },
    ignores: ['*.cjs', '*.spec.ts'],
    rules: {
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'import/no-unresolved': 'error',
      'import/no-named-as-default-member': 'off',
      'import/no-default-export': 'error',
      'prettier/prettier': 'error',
    },
  },
];
