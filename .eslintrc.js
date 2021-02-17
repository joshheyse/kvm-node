module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'prettier/@typescript-eslint',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  ignorePatterns: ['node_modules', 'build', 'dist', 'amplify', '*.js'],
  plugins: ['@typescript-eslint', 'jest'],
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

    'indent': 'off',
    'brace-style': ['error', 'stroustrup'],
    '@typescript-eslint/indent': ['error', 2],

    // Not that civilized
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',

    // This has to be set to off to prevent errors when import modules from lerna root
    'import/no-extraneous-dependencies': 'off',

    // Why would you want unused vars?
    '@typescript-eslint/no-unused-vars': ['error'],

    // Don't require extensions, except for non js/ts files
    'import/extensions': ['error', 'never', { 'svg': 'always', 'css': 'always', 'scss': 'always', 'json': 'always'  }],
  },
};
