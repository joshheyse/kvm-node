module.exports = {
  extends: [
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['node_modules', 'build', 'dist', 'amplify', '*.js'],
  plugins: ['react', '@typescript-eslint', 'jest'],
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {

    // Let's be civilized

    // Semis for live
    'semi': ['error', 'always'],
    '@typescript-eslint/semi': ['error', 'always'],
    // Single quotes
    'quotes': ['error', 'single'],
    // Don't mix line breaks
    'linebreak-style': ['error', 'unix'],

    // Not that civilized
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // This has to be set to off to prevent errors when import modules from lerna root
    'import/no-extraneous-dependencies': 'off',

    // We will use TypeScript's types for component props instead
    'react/prop-types': 'off',

    // No need to import React when using Next.js
    'react/react-in-jsx-scope': 'off',
    'react/no-array-index-key': 'off',
    'react/require-default-props': 'off',

    // This rule is not compatible with Next.js's <Link /> components
    'jsx-a11y/anchor-is-valid': 'off',

    // Why would you want unused vars?
    '@typescript-eslint/no-unused-vars': ['error'],

    // Don't require extensions, except for non js/ts files
    'import/extensions': ['error', 'never', { 'svg': 'always', 'css': 'always', 'scss': 'always', 'json': 'always'  }],

    'prettier/prettier': ['error', {}, { usePrettierrc: true }], // Includes .prettierrc.js rules
  },
};
